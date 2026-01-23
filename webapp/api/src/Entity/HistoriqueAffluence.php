<?php

namespace App\Entity;

use App\Repository\HistoriqueAffluenceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HistoriqueAffluenceRepository::class)]
class HistoriqueAffluence
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;    

    #[ORM\ManyToOne(inversedBy: 'historiqueAffluences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Restaurant $restaurant = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $date_historique = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $holiday_name = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_holiday = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_school_vacations = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $vacation_name = null;

    #[ORM\Column(nullable: true)]
    private ?int $weather_code = null;

    #[ORM\Column(nullable: true)]
    private ?float $tmax = null;

    #[ORM\Column(nullable: true)]
    private ?float $tmin = null;

    #[ORM\Column(nullable: true)]
    private ?float $prcp = null;

    #[ORM\Column(nullable: true)]
    private ?float $wspd = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $day_of_week = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_weekend = null;

    #[ORM\Column(nullable: true)]
    private ?int $affluence = null;

    #[ORM\Column(nullable: true)]
    private ?float $occupancy_rate = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_full = null;

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

    public function getDateHistorique(): ?\DateTime
    {
        return $this->date_historique;
    }

    public function setDateHistorique(?\DateTime $date_historique): static
    {
        $this->date_historique = $date_historique;

        return $this;
    }

    public function getHolidayName(): ?string
    {
        return $this->holiday_name;
    }

    public function setHolidayName(?string $holiday_name): static
    {
        $this->holiday_name = $holiday_name;

        return $this;
    }

    public function isHoliday(): ?bool
    {
        return $this->is_holiday;
    }

    public function setIsHoliday(?bool $is_holiday): static
    {
        $this->is_holiday = $is_holiday;

        return $this;
    }

    public function isSchoolVacations(): ?bool
    {
        return $this->is_school_vacations;
    }

    public function setIsSchoolVacations(?bool $is_school_vacations): static
    {
        $this->is_school_vacations = $is_school_vacations;

        return $this;
    }

    public function getVacationName(): ?string
    {
        return $this->vacation_name;
    }

    public function setVacationName(?string $vacation_name): static
    {
        $this->vacation_name = $vacation_name;

        return $this;
    }

    public function getWeatherCode(): ?int
    {
        return $this->weather_code;
    }

    public function setWeatherCode(?int $weather_code): static
    {
        $this->weather_code = $weather_code;

        return $this;
    }

    public function getTmax(): ?float
    {
        return $this->tmax;
    }

    public function setTmax(?float $tmax): static
    {
        $this->tmax = $tmax;

        return $this;
    }

    public function getTmin(): ?float
    {
        return $this->tmin;
    }

    public function setTmin(?float $tmin): static
    {
        $this->tmin = $tmin;

        return $this;
    }

    public function getPrcp(): ?float
    {
        return $this->prcp;
    }

    public function setPrcp(?float $prcp): static
    {
        $this->prcp = $prcp;

        return $this;
    }

    public function getWspd(): ?float
    {
        return $this->wspd;
    }

    public function setWspd(?float $wspd): static
    {
        $this->wspd = $wspd;

        return $this;
    }

    public function getDayOfWeek(): ?string
    {
        return $this->day_of_week;
    }

    public function setDayOfWeek(?string $day_of_week): static
    {
        $this->day_of_week = $day_of_week;

        return $this;
    }

    public function isWeekend(): ?bool
    {
        return $this->is_weekend;
    }

    public function setIsWeekend(?bool $is_weekend): static
    {
        $this->is_weekend = $is_weekend;

        return $this;
    }

    public function getAffluence(): ?int
    {
        return $this->affluence;
    }

    public function setAffluence(?int $affluence): static
    {
        $this->affluence = $affluence;

        return $this;
    }

    public function getOccupancyRate(): ?float
    {
        return $this->occupancy_rate;
    }

    public function setOccupancyRate(?float $occupancy_rate): static
    {
        $this->occupancy_rate = $occupancy_rate;

        return $this;
    }

    public function isFull(): ?bool
    {
        return $this->is_full;
    }

    public function setIsFull(?bool $is_full): static
    {
        $this->is_full = $is_full;

        return $this;
    }
}
