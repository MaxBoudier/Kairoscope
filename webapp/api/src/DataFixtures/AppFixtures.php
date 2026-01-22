<?php

namespace App\DataFixtures;

use App\Factory\EventFactory;
use App\Factory\HistoriqueAffluenceFactory;
use App\Factory\ListeTyperestaurantFactory;
use App\Factory\NotificationFactory;
use App\Factory\RestaurantDataFactory;
use App\Factory\RestaurantFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        ListeTyperestaurantFactory::createMany(5);

        // Create 10 Users, each with exactly 1 Restaurant and 1 RestaurantData
        for ($i = 0; $i < 10; $i++) {
            $user = UserFactory::createOne();

            $restaurant = RestaurantFactory::createOne([
                'restaurant_user' => $user,
                'type_restaurant' => ListeTyperestaurantFactory::random(),
            ]);

            RestaurantDataFactory::createOne([
                'restaurant' => $restaurant,
            ]);
        }

        EventFactory::createMany(100);
        HistoriqueAffluenceFactory::createMany(100);
        NotificationFactory::createMany(50);
    }
}
