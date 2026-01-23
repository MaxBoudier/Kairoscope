<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260123162250 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN prcd TO prcp');
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN is_complet TO is_full');
        // Handle rename and type change for occupancy_rate
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN pourcentage_occupation TO occupancy_rate');
        $this->addSql('ALTER TABLE historique_affluence ALTER occupancy_rate TYPE DOUBLE PRECISION');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN prcp TO prcd');
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN is_full TO is_complet');
        $this->addSql('ALTER TABLE historique_affluence ALTER occupancy_rate TYPE INT');
        $this->addSql('ALTER TABLE historique_affluence RENAME COLUMN occupancy_rate TO pourcentage_occupation');
    }
}
