<?php

namespace App\Entity;

use App\Repository\RestaurantDataRepository;
use BcMath\Number;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RestaurantDataRepository::class)]
class RestaurantData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'restaurantData', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Restaurant $restaurant = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $max_nb_couvert = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_terrasse = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRestaurant(): ?Restaurant
    {
        return $this->restaurant;
    }

    public function setRestaurant(Restaurant $restaurant): static
    {
        $this->restaurant = $restaurant;

        return $this;
    }

    public function getMaxNbCouvert(): ?int
    {
        return $this->max_nb_couvert;
    }

    public function setMaxNbCouvert(?int $max_nb_couvert): static
    {
        $this->max_nb_couvert = $max_nb_couvert;

        return $this;
    }

    public function isTerrasse(): ?bool
    {
        return $this->is_terrasse;
    }

    public function setIsTerrasse(?bool $is_terrasse): static
    {
        $this->is_terrasse = $is_terrasse;

        return $this;
    }
}
