<?php

namespace App\Factory;

use App\Entity\HistoriqueAffluence;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<HistoriqueAffluence>
 */
final class HistoriqueAffluenceFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    public static function class(): string
    {
        return HistoriqueAffluence::class;
    }

    protected function defaults(): array|callable
    {
        return [
            // Relation : On crée ou lie un restaurant aléatoire
            'restaurant' => RestaurantFactory::random(), 

            // Dates et temps
            'date_historique' => self::faker()->dateTimeBetween('-1 year', 'now'),
            'day_of_week' => self::faker()->dayOfWeek(),
            'is_weekend' => self::faker()->boolean(),

            // Données Météo
            'weather_code' => self::faker()->numberBetween(0, 99),
            'tmax' => self::faker()->numberBetween(15, 38),
            'tmin' => self::faker()->numberBetween(-5, 15),
            'prcd' => self::faker()->numberBetween(0, 100),
            'wspd' => self::faker()->numberBetween(0, 50),

            // Vacances et jours fériés
            'is_holiday' => self::faker()->boolean(10), // 10% de chance
            'holiday_name' => self::faker()->optional(0.1)->word(),
            'is_school_vacations' => self::faker()->boolean(20),
            'vacation_name' => self::faker()->optional(0.2)->sentence(2),

            // Données d'affluence (le cœur de ton métier)
            'affluence' => self::faker()->numberBetween(5, 150),
            'pourcentage_occupation' => self::faker()->numberBetween(0, 100),
            'is_complet' => self::faker()->boolean(15), // 15% de chance d'être complet
        ];
    }

    protected function initialize(): static
    {
        return $this;
    }
}