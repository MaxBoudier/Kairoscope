<?php

namespace App\Controller;

use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/events')]
#[IsGranted('IS_AUTHENTICATED_FULLY')]
class EventController extends AbstractController
{
    #[Route('/upcoming', name: 'api_events_upcoming', methods: ['GET'])]
    public function getUpcomingEvents(EventRepository $eventRepository): JsonResponse
    {
        $user = $this->getUser();

        $events = $eventRepository->findUpcomingEvents();

        $data = [];
        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'nom' => $event->getNom(),
                'categorie' => $event->getCategorie(),
                'type_lieu' => $event->getTypeLieu(),
                'affluence_estimee' => $event->getAffluenceEstimee(),
                'distance_metres' => $event->getDistanceMetres(),
                'horaire_debut' => $event->getHoraireDebut(),
                'date_event' => $event->getDateEvent()?->format('Y-m-d'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/all', name: 'api_events_all', methods: ['GET'])]
    public function getAllEvents(EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findAllEventsSorted();

        $data = [];
        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'nom' => $event->getNom(),
                'categorie' => $event->getCategorie(),
                'type_lieu' => $event->getTypeLieu(),
                'affluence_estimee' => $event->getAffluenceEstimee(),
                'distance_metres' => $event->getDistanceMetres(),
                'horaire_debut' => $event->getHoraireDebut(),
                'date_event' => $event->getDateEvent()?->format('Y-m-d'),
            ];
        }

        return $this->json($data);
    }
    #[Route('/sync', name: 'api_events_sync', methods: ['POST'])]
    public function syncEvents(\Symfony\Component\HttpFoundation\Request $request, EventRepository $eventRepository, \Doctrine\ORM\EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var \App\Entity\User|null $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['message' => 'User not found'], 404);
        }
        $restaurant = $user->getRestaurant();
        if (!$restaurant) {
            return $this->json(['message' => 'Restaurant not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['message' => 'Invalid data format'], 400);
        }

        // Strategy: Clear existing upcoming events for this restaurant?
        // User said "replace the data in the event table with the json data".
        // To be safe and clean, let's remove multiple events for valid dates or simple clear.
        // For now, let's just add/update. To avoid duplicates, maybe delete events for the dates we are receiving?
        
        // Simpler approach for "remplaces": Delete all upcoming events for this restaurant to avoid stale data
        // $entityManager->createQuery('DELETE FROM App\Entity\Event e WHERE e.restaurant = :restaurant')
        //     ->setParameter('restaurant', $restaurant)
        //     ->execute();
        // However, this might delete past events too? The user JSON has "date".
        // Let's delete events that match the dates in the payload?
        
        // Actually, let's just iterate and insert. If the user wants "replace", they might mean "populate".
        // I will clear events *for the dates provided in the payload* to avoid duplication.
        
        foreach ($data as $dayData) {
            if (!isset($dayData['date']) || !isset($dayData['events'])) {
                continue;
            }
            
            $date = new \DateTime($dayData['date']);
            
            // Remove existing events for this date/restaurant
            $existingEvents = $eventRepository->findBy([
                'restaurant' => $restaurant,
                'date_event' => $date
            ]);
            foreach ($existingEvents as $existing) {
                $entityManager->remove($existing);
            }
            
            foreach ($dayData['events'] as $eventData) {
                // If the event name is empty or looks like a placeholder, skip?
                // The example had "Marché bi-hebdomadaire".
                
                $event = new \App\Entity\Event();
                $event->setRestaurant($restaurant);
                $event->setDateEvent($date);
                $event->setNom($eventData['nom'] ?? 'Événement inconnu');
                $event->setCategorie($eventData['categorie'] ?? null);
                $event->setTypeLieu($eventData['type_lieu'] ?? null);
                $event->setAffluenceEstimee($eventData['affluence_estimee_personnes'] ?? null);
                $event->setDistanceMetres($eventData['distance_metres'] ?? null);
                $event->setHoraireDebut($eventData['horaire_debut'] ?? null);
                
                $entityManager->persist($event);
            }
        }

        $entityManager->flush();

        return $this->json(['message' => 'Events synced successfully']);
    }
}
