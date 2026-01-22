<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Repository\UserRepository;

class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(['error' => 'Identifiants invalides'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'firstname' => $user->getPrenomGerant(),
            'lastname' => $user->getNomGerant(),
        ]);
    }

    #[Route('/api/logout', name: 'app_logout')]
    public function logout(): void
    {
        // Symfony gère ça tout seul
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getCurrentUser(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'firstname' => $user->getPrenomGerant(),
            'lastname' => $user->getNomGerant(),
        ]);
    }

    #[Route('/api/public/user-check', name: 'api_user_check', methods: ['GET'])]
    public function checkUserCount(UserRepository $userRepository): JsonResponse
    {
        $count = $userRepository->count([]);
        return $this->json([
            'count' => $count,
            'hasUsers' => $count > 0
        ]);
    }

    #[Route('/api/public/register-first', name: 'api_register_first', methods: ['POST'])]
    public function registerFirstUser(
        Request $request,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $count = $userRepository->count([]);

        // Sécurité : On ne permet cette action que s'il n'y a AUCUN utilisateur
        if ($count > 0) {
            return $this->json(['error' => 'L\'initialisation a déjà été effectuée.'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->json(['error' => 'Email et mot de passe requis.'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setRoles(['ROLE_ADMIN']);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        
        // Initialisation des champs obligatoires avec des valeurs par défaut
        $user->setPseudo($data['pseudo'] ?? 'Admin');
        $user->setNomGerant($data['nom_gerant'] ?? 'Administrateur');
        $user->setPrenomGerant($data['prenom_gerant'] ?? 'Principal');
        $user->setCodeSettings($data['code_settings'] ?? 0);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Premier administrateur créé avec succès',
            'email' => $user->getUserIdentifier()
        ], 201);
    }
}