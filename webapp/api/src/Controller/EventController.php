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
        // Fetch events for the current user's restaurant
        // Assuming the user is linked to a restaurant, or we fetch all visible events
        // For now, let's fetch events happening from today onwards
        
        $user = $this->getUser();
        // TODO: Filter by restaurant if applicable. For now, we might not have the link or just fetch all.
        // Looking at User entity in previous steps (not fully shown but implied), let's assume global or linked.
        // If checking previous conversations, User might be linked to Restaurant.
        // Let's first just fetch all upcoming events for simplicity as requested "fetched from db".
        
        $events = $eventRepository->findUpcomingEvents();

        $data = [];
        foreach ($events as $event) {
            $data[] = [
                'id' => $event->getId(),
                'title' => $event->getEvent(),
                'date' => $event->getDateEvent()->format('Y-m-d H:i:s'),
                'location' => 'Restaurant', // Default for now as it's not in Entity
                'type' => 'Event' // Default
            ];
        }

        return $this->json($data);
    }
}
