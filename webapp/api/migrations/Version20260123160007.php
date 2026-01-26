<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260123160007 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE historique_affluence ALTER tmax TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE historique_affluence ALTER tmin TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE historique_affluence ALTER prcd TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE historique_affluence ALTER wspd TYPE DOUBLE PRECISION');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE historique_affluence ALTER tmax TYPE INT');
        $this->addSql('ALTER TABLE historique_affluence ALTER tmin TYPE INT');
        $this->addSql('ALTER TABLE historique_affluence ALTER prcd TYPE INT');
        $this->addSql('ALTER TABLE historique_affluence ALTER wspd TYPE INT');
    }
}
