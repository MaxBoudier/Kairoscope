<?php

namespace App\Controller;

use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/notifications', name: 'api_notifications_')]
class NotificationController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupérer l'utilisateur connecté (le gérant)
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }
        //Exemple si vous avez une relation User -> Restaurant -> Notification
        $restaurant = $user->getRestaurant(); 
        $notifications = $restaurant ? $restaurant->getNotifications() : [];

        //Pour l'instant, on renvoie une liste vide pour éviter l'erreur 404
        //et on laisse le soin d'implémenter la vraie récupération
        $notifications = [];

        return $this->json($notifications);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(Notification $notification, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($notification);
        $entityManager->flush();

        return new JsonResponse(null, 204);
    }
}
