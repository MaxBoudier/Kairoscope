<?php

namespace App\Factory;

use App\Entity\Event;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Event>
 */
final class EventFactory extends PersistentObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Event::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'restaurant' => RestaurantFactory::random(),
            'nom' => self::faker()->text(50),
            'categorie' => self::faker()->randomElement(['FAMILLE', 'CONCERT', 'FESTIVAL']),
            'type_lieu' => self::faker()->randomElement(['INTERIEUR', 'EXTERIEUR']),
            'affluence_estimee' => self::faker()->numberBetween(100, 5000),
            'distance_metres' => self::faker()->numberBetween(0, 1000),
            'horaire_debut' => self::faker()->time('H:i'),
            'date_event' => self::faker()->dateTime(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Event $event): void {})
        ;
    }
}
