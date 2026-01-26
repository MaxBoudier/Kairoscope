<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\RestaurantData;

final class SettingsController extends AbstractController
{
    #[Route('/api/settings', name: 'app_settings')]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $restaurant = $user->getRestaurant();

        if (!$restaurant) {
            return $this->json([
                'id' => null,
                'nom' => '',
                'ville' => '',
                'adresse' => '',
                'codePostal' => '',
                'maxNbCouvert' => 0,
                'isTerrasse' => false,
            ]);
        }
        
        $restaurantData = $restaurant->getRestaurantData();
        
        return $this->json([
            'id' => $restaurant->getId(),
            'nom' => $restaurant->getNom(),
            'ville' => $restaurant->getVille(),
            'adresse' => $restaurant->getAdresse(),
            'codePostal' => $restaurant->getCodePostal(),
            'typeRestaurant' => $restaurant->getTypeRestaurant(),
            'maxNbCouvert' => $restaurantData?->getMaxNbCouvert() ?? 0,
            'isTerrasse' => $restaurantData?->isTerrasse() ?? false,
        ]);
    }

    #[Route('/api/settings/update', name: 'app_settings_update', methods: ['POST'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        error_log('SettingsController: Update called');
        if (!$user) {
            error_log('SettingsController: No user matched');
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $restaurant = $user->getRestaurant();

        // Create restaurant if it doesn't exist
        if (!$restaurant) {
            $restaurant = new \App\Entity\Restaurant();
            $restaurant->setRestaurantUser($user);
            $restaurant->setNom('');     // Initialize with defaults to avoid null violations if partial update
            $restaurant->setVille('');
            $restaurant->setAdresse('');
            $restaurant->setCodePostal('');
            $restaurant->setTypeRestaurant('default'); // Required field
            
            $restaurantData = new RestaurantData();
            $restaurantData->setRestaurant($restaurant);
            $restaurantData->setMaxNbCouvert(0);
            $restaurantData->setIsTerrasse(false);
            $restaurant->setRestaurantData($restaurantData);
            
            $entityManager->persist($restaurant);
            $entityManager->persist($restaurantData);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            error_log('SettingsController: Invalid JSON or empty body');
            return $this->json(['message' => 'Invalid JSON or empty body'], 400);
        }
        error_log('SettingsController: Received data: ' . print_r($data, true));

        // Update Restaurant basic info
        if (isset($data['nom'])) {
            $restaurant->setNom($data['nom']);
        }
        if (isset($data['ville'])) {
            $restaurant->setVille($data['ville']);
        }
        if (isset($data['adresse'])) {
            $restaurant->setAdresse($data['adresse']);
        }
        if (isset($data['codePostal'])) {
            $restaurant->setCodePostal($data['codePostal']);
        }
        if (isset($data['typeRestaurant'])) {
            $restaurant->setTypeRestaurant($data['typeRestaurant']);
        }

        // Update RestaurantData (create if not exists)
        $restaurantData = $restaurant->getRestaurantData();
        if (!$restaurantData) {
            $restaurantData = new RestaurantData();
            $restaurantData->setRestaurant($restaurant);
            $restaurant->setRestaurantData($restaurantData);
            $entityManager->persist($restaurantData);
        }

        if (isset($data['maxNbCouvert'])) {
            $restaurantData->setMaxNbCouvert((int)$data['maxNbCouvert']);
        }
        if (isset($data['isTerrasse'])) {
            $restaurantData->setIsTerrasse((bool)$data['isTerrasse']);
        }

        $entityManager->flush();

        return $this->json([
            'message' => 'Paramètres mis à jour avec succès',
            'restaurant' => [
                'id' => $restaurant->getId(),
                'nom' => $restaurant->getNom(),
                'ville' => $restaurant->getVille(),
                'adresse' => $restaurant->getAdresse(),
                'codePostal' => $restaurant->getCodePostal(),
                'typeRestaurant' => $restaurant->getTypeRestaurant(),
                'maxNbCouvert' => $restaurantData->getMaxNbCouvert(),
                'isTerrasse' => $restaurantData->isTerrasse(),
            ]
        ]);
    }
    #[Route('/api/settings/verify-pin', name: 'app_settings_verify_pin', methods: ['POST'])]
    public function verifyPin(Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $pin = $data['pin'] ?? null;

        if (!$pin) {
            return $this->json(['message' => 'PIN code is required'], 400);
        }

        // Loose comparison since DB column might be string but JSON sends string "1234"
        if ($user->getCodeSettings() == $pin) {
             return $this->json(['success' => true]);
        }

        return $this->json(['success' => false, 'message' => 'Code PIN incorrect'], 403);
    }
}   

