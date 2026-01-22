<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Entity\User;

final class HomeController extends AbstractController
{

    #[Route('/', name: 'app_root')]
    #[Route('/home', name: 'app_home')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/HomeController.php',
        ]);
    }
    #[Route('/notifications', name: 'app_notifications')]
    public function notifications(#[CurrentUser] ?User $user): JsonResponse
    {
        // On récupère les notifications du restaurant que possède l'utilisateur connecté
        if (!$user) {
            return $this->json([
                'message' => 'Vous devez être connecté pour accéder à cette page',
            ], 401);
        }
        $restaurant = $user->getRestaurant();
        if (!$restaurant) {
            return $this->json([
                'message' => 'Vous devez avoir un restaurant pour accéder à cette page',
            ], 401);
        }
        $notifications = $restaurant->getNotifications();
        return $this->json($notifications, 200, [], ['groups' => 'notifications:read']);
    }
}