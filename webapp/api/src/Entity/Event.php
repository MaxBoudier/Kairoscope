<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Restaurant $restaurant = null;

    #[ORM\Column]
    private ?string $nom = null;

    #[ORM\Column(nullable: true)]
    private ?string $categorie = null;

    #[ORM\Column(nullable: true)]
    private ?string $type_lieu = null;

    #[ORM\Column(nullable: true)]
    private ?int $affluence_estimee = null;

    #[ORM\Column(nullable: true)]
    private ?int $distance_metres = null;

    #[ORM\Column(nullable: true)]
    private ?string $horaire_debut = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $date_event = null; // Keep this for the date part

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRestaurant(): ?Restaurant
    {
        return $this->restaurant;
    }

    public function setRestaurant(?Restaurant $restaurant): static
    {
        $this->restaurant = $restaurant;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getCategorie(): ?string
    {
        return $this->categorie;
    }

    public function setCategorie(?string $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getTypeLieu(): ?string
    {
        return $this->type_lieu;
    }

    public function setTypeLieu(?string $type_lieu): static
    {
        $this->type_lieu = $type_lieu;

        return $this;
    }

    public function getAffluenceEstimee(): ?int
    {
        return $this->affluence_estimee;
    }

    public function setAffluenceEstimee(?int $affluence_estimee): static
    {
        $this->affluence_estimee = $affluence_estimee;

        return $this;
    }

    public function getDistanceMetres(): ?int
    {
        return $this->distance_metres;
    }

    public function setDistanceMetres(?int $distance_metres): static
    {
        $this->distance_metres = $distance_metres;

        return $this;
    }

    public function getHoraireDebut(): ?string
    {
        return $this->horaire_debut;
    }

    public function setHoraireDebut(?string $horaire_debut): static
    {
        $this->horaire_debut = $horaire_debut;

        return $this;
    }

    public function getDateEvent(): ?\DateTime
    {
        return $this->date_event;
    }

    public function setDateEvent(?\DateTime $date_event): static
    {
        $this->date_event = $date_event;

        return $this;
    }
}
