<?php

namespace App\Controller\Admin;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface; // POUR LE SERIALIZER
 #[Route('/api/admin/utilisateur')]
final class UtilisateurController extends AbstractController
{
    #[Route('', name: 'app_admin_utilisateur')]
    public function index( EntityManagerInterface $em): JsonResponse
    {
        $utilisateurs = $em->getRepository(User::class)->findAll();

        return $this->json($utilisateurs);
    }


    #[Route('/new', name: 'app_admin_utilisateur_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $em,SerializerInterface $serializer): JsonResponse
    {
   

        try {
          
        $utilisateur = $serializer->deserialize(
            $request->getContent(), 
            User::class, 
            'json'
        );

        // 2. Persistance
        $em->persist($utilisateur);
        $em->flush();

        // 3. Retourne l'objet complet (avec son ID généré)
        return $this->json($utilisateur, Response::HTTP_CREATED);

    } catch (\Exception $e) {
        // Gestion d'erreur si le JSON est mal formé
        return $this->json([
            'error' => 'Données invalides'
        ], Response::HTTP_BAD_REQUEST);
    }
    }


}
