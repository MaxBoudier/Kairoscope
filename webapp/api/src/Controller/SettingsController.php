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
    #[Route('/settings', name: 'app_settings')]
    public function index(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $restaurant = $user->getRestaurant();

        if (!$restaurant) {
            return $this->json(['message' => 'Aucun restaurant associé'], 404);
        }
        
        $restaurantData = $restaurant->getRestaurantData();
        
        return $this->json([
            'id' => $restaurant->getId(),
            'nom' => $restaurant->getNom(),
            'ville' => $restaurant->getVille(),
            'adresse' => $restaurant->getAdresse(),
            'codePostal' => $restaurant->getCodePostal(),
            'maxNbCouvert' => $restaurantData?->getMaxNbCouvert() ?? 0,
            'isTerrasse' => $restaurantData?->isTerrasse() ?? false,
        ]);
    }

    #[Route('/settings/update', name: 'app_settings_update', methods: ['POST'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $restaurant = $user->getRestaurant();

        if (!$restaurant) {
            return $this->json(['message' => 'Aucun restaurant associé'], 404);
        }

        $data = json_decode($request->getContent(), true);

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
                'maxNbCouvert' => $restaurantData->getMaxNbCouvert(),
                'isTerrasse' => $restaurantData->isTerrasse(),
            ]
        ]);
    }
}   

