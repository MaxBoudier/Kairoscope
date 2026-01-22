<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notifications:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notifications:read'])]
    private ?string $message = null;

    #[ORM\Column]
    #[Groups(['notifications:read'])]
    private ?\DateTime $date_notification = null;

    #[ORM\ManyToOne(inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Restaurant $restaurant = null;

    #[Groups(['notifications:read'])]
    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['notifications:read'])]
    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    #[Groups(['notifications:read'])]
    public function getDateNotification(): ?\DateTime
    {
        return $this->date_notification;
    }

    public function setDateNotification(\DateTime $date_notification): static
    {
        $this->date_notification = $date_notification;

        return $this;
    }

    public function getIdRestaurant(): ?Restaurant
    {
        return $this->restaurant;
    }

    public function setRestaurant(?Restaurant $restaurant): static
    {
        $this->restaurant = $restaurant;

        return $this;
    }
}
