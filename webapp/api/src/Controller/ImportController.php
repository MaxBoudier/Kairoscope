<?php

namespace App\Controller;

use App\Entity\HistoriqueAffluence;
use App\Entity\Restaurant;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class ImportController extends AbstractController
{
    #[Route('/import/historical-affluence', name: 'api_import_historical_affluence', methods: ['POST'])]
    public function import(Request $request, EntityManagerInterface $entityManager, #[CurrentUser] ?User $user): JsonResponse
    {
        error_log('ImportController: Import called');
        
        if (!$user) {
            return $this->json(['message' => 'Unauthorized'], 401);
        }

        $restaurant = $user->getRestaurant();
        if (!$restaurant) {
            return $this->json(['message' => 'Restaurant not found for this user'], 404);
        }

        $file = $request->files->get('file');

        if (!$file) {
            return $this->json(['message' => 'No file uploaded'], 400);
        }

        if ($file->getClientOriginalExtension() !== 'csv') {
           // Basic check, though usually checking mime type is better
            return $this->json(['message' => 'Invalid file type. Please upload a CSV file.'], 400);
        }

        $handle = fopen($file->getPathname(), 'r');
        if ($handle === false) {
            return $this->json(['message' => 'Could not open file'], 500);
        }

        $headers = fgetcsv($handle);
        if ($headers === false) {
             fclose($handle);
             return $this->json(['message' => 'Empty file or read error'], 400);
        }

        // Normalize headers to match entity fields (snake_case)
        $normalizedHeaders = array_map(function($h) {
            return trim(strtolower($h));
        }, $headers);

        $rowCount = 0;
        $batchSize = 20;

        while (($data = fgetcsv($handle)) !== false) {
            if (count($data) !== count($headers)) {
                continue; // Skip malformed rows
            }

            $row = array_combine($normalizedHeaders, $data);
            
            $history = new HistoriqueAffluence();
            $history->setRestaurant($restaurant);

            // Map fields dynamically or manually
            // Manual mapping ensures type safety and handling of specific formats
            
            if (isset($row['date_historique'])) {
                try {
                    $history->setDateHistorique(new \DateTime($row['date_historique']));
                } catch (\Exception $e) {
                    // Log error or skip? 
                    error_log("Date parsing error: " . $e->getMessage());
                }
            } elseif (isset($row['date'])) {
                 try {
                    $history->setDateHistorique(new \DateTime($row['date']));
                } catch (\Exception $e) {}
            }

            if (isset($row['affluence'])) $history->setAffluence((int)$row['affluence']);
            if (isset($row['pourcentage_occupation'])) $history->setPourcentageOccupation((int)$row['pourcentage_occupation']);
            if (isset($row['is_complet'])) $history->setIsComplet(filter_var($row['is_complet'], FILTER_VALIDATE_BOOLEAN));
            
            // Weather
            if (isset($row['weather_code'])) $history->setWeatherCode((int)$row['weather_code']);
            if (isset($row['tmax'])) $history->setTmax((int)$row['tmax']);
            if (isset($row['tmin'])) $history->setTmin((int)$row['tmin']);
            if (isset($row['prcd'])) $history->setPrcd((int)$row['prcd']);
            if (isset($row['wspd'])) $history->setWspd((int)$row['wspd']);

            // Calendar
            if (isset($row['holiday_name'])) $history->setHolidayName($row['holiday_name']);
            if (isset($row['is_holiday'])) $history->setIsHoliday(filter_var($row['is_holiday'], FILTER_VALIDATE_BOOLEAN));
            if (isset($row['is_school_vacations'])) $history->setIsSchoolVacations(filter_var($row['is_school_vacations'], FILTER_VALIDATE_BOOLEAN));
            if (isset($row['vacation_name'])) $history->setVacationName($row['vacation_name']);
            if (isset($row['day_of_week'])) $history->setDayOfWeek($row['day_of_week']);
            if (isset($row['is_weekend'])) $history->setIsWeekend(filter_var($row['is_weekend'], FILTER_VALIDATE_BOOLEAN));


            $entityManager->persist($history);
            
            $rowCount++;
            if (($rowCount % $batchSize) === 0) {
                $entityManager->flush();
                $entityManager->clear(); // Detach all objects from Doctrine for performance
                // Note: Re-fetching restaurant is needed if we clear, 
                // but since we are just persisting new entities linked to it by reference ID internally, 
                // careful with clear(). 
                // Better: Just flush, don't clear restaurant. 
                // Actually if I clear, I lose the $restaurant object which is managed.
                // Re-fetch restaurant:
                $restaurant = $entityManager->getRepository(Restaurant::class)->find($restaurant->getId());
            }
        }

        $entityManager->flush();
        fclose($handle);

        return $this->json(['message' => "Import successful. $rowCount rows processed."]);
    }
}
