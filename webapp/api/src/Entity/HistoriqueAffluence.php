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
    private ?int $tmax = null;

    #[ORM\Column(nullable: true)]
    private ?int $tmin = null;

    #[ORM\Column(nullable: true)]
    private ?int $prcd = null;

    #[ORM\Column(nullable: true)]
    private ?int $wspd = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $day_of_week = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_weekend = null;

    #[ORM\Column(nullable: true)]
    private ?int $affluence = null;

    #[ORM\Column(nullable: true)]
    private ?int $pourcentage_occupation = null;

    #[ORM\Column(nullable: true)]
    private ?bool $is_complet = null;

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

    public function getTmax(): ?int
    {
        return $this->tmax;
    }

    public function setTmax(?int $tmax): static
    {
        $this->tmax = $tmax;

        return $this;
    }

    public function getTmin(): ?int
    {
        return $this->tmin;
    }

    public function setTmin(?int $tmin): static
    {
        $this->tmin = $tmin;

        return $this;
    }

    public function getPrcd(): ?int
    {
        return $this->prcd;
    }

    public function setPrcd(?int $prcd): static
    {
        $this->prcd = $prcd;

        return $this;
    }

    public function getWspd(): ?int
    {
        return $this->wspd;
    }

    public function setWspd(?int $wspd): static
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

    public function getPourcentageOccupation(): ?int
    {
        return $this->pourcentage_occupation;
    }

    public function setPourcentageOccupation(?int $pourcentage_occupation): static
    {
        $this->pourcentage_occupation = $pourcentage_occupation;

        return $this;
    }

    public function isComplet(): ?bool
    {
        return $this->is_complet;
    }

    public function setIsComplet(?bool $is_complet): static
    {
        $this->is_complet = $is_complet;

        return $this;
    }
}
