<?php

namespace App\Entity;

use App\Repository\RestaurantRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RestaurantRepository::class)]
class Restaurant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Ville = null;

    #[ORM\Column(length: 255)]
    private ?string $Nom = null;

    #[ORM\Column(length: 255)]
    private ?string $adresse = null;

    #[ORM\Column(type: Types::STRING)]
    private ?string $code_postal = null;

    #[ORM\OneToOne(inversedBy: 'restaurant', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $restaurant_user = null;

    #[ORM\OneToOne(mappedBy: 'restaurant', cascade: ['persist', 'remove'])]
    private ?RestaurantData $restaurantData = null;

    #[ORM\Column(length: 255)]
    private ?string $type_restaurant = null;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'restaurant', orphanRemoval: true)]
    private Collection $notifications;

    /**
     * @var Collection<int, Event>
     */
    #[ORM\OneToMany(targetEntity: Event::class, mappedBy: 'restaurant')]
    private Collection $events;

    /**
     * @var Collection<int, HistoriqueAffluence>
     */
    #[ORM\OneToMany(targetEntity: HistoriqueAffluence::class, mappedBy: 'restaurant')]
    private Collection $historiqueAffluences;

    public function __construct()
    {
        $this->notifications = new ArrayCollection();
        $this->events = new ArrayCollection();
        $this->historiqueAffluences = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVille(): ?string
    {
        return $this->Ville;
    }

    public function setVille(?string $Ville): static
    {
        $this->Ville = $Ville;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->Nom;
    }

    public function setNom(string $Nom): static
    {
        $this->Nom = $Nom;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->code_postal;
    }

    public function setCodePostal(string $code_postal): static
    {
        $this->code_postal = $code_postal;

        return $this;
    }

    public function getRestaurantUser(): ?User
    {
        return $this->restaurant_user;
    }

    public function setRestaurantUser(User $restaurant_user): static
    {
        $this->restaurant_user = $restaurant_user;

        return $this;
    }

    public function getRestaurantData(): ?RestaurantData
    {
        return $this->restaurantData;
    }

    public function setRestaurantData(RestaurantData $restaurantData): static
    {
        // set the owning side of the relation if necessary
        if ($restaurantData->getRestaurant() !== $this) {
            $restaurantData->setRestaurant($this);
        }

        $this->restaurantData = $restaurantData;

        return $this;
    }

    public function getTypeRestaurant(): ?string
    {
        return $this->type_restaurant;
    }

    public function setTypeRestaurant(?string $type_restaurant): static
    {
        $this->type_restaurant = $type_restaurant;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setRestaurant($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getIdRestaurant() === $this) {
                $notification->setRestaurant(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Event>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Event $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->setRestaurant($this);
        }

        return $this;
    }

    public function removeEvent(Event $event): static
    {
        if ($this->events->removeElement($event)) {
            // set the owning side to null (unless already changed)
            if ($event->getRestaurant() === $this) {
                $event->setRestaurant(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, HistoriqueAffluence>
     */
    public function gethistoriqueAffluences(): Collection
    {
        return $this->historiqueAffluences;
    }

    public function addHistoriqueAffluence(HistoriqueAffluence $HistoriqueAffluence): static
    {
        if (!$this->historiqueAffluences->contains($HistoriqueAffluence)) {
            $this->historiqueAffluences->add($HistoriqueAffluence);
            $HistoriqueAffluence->setRestaurant($this);
        }

        return $this;
    }

    public function removeHistoriqueAffluence(HistoriqueAffluence $HistoriqueAffluence): static
    {
        if ($this->historiqueAffluences->removeElement($HistoriqueAffluence)) {
            // set the owning side to null (unless already changed)
            if ($HistoriqueAffluence->getRestaurant() === $this) {
                $HistoriqueAffluence->setRestaurant(null);
            }
        }

        return $this;
    }

}
