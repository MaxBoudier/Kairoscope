<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260119214430 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event DROP CONSTRAINT fk_3bae0aa7fcfa10b');
        $this->addSql('DROP INDEX idx_3bae0aa7fcfa10b');
        $this->addSql('ALTER TABLE event RENAME COLUMN id_restaurant_id TO restaurant_id');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7B1E7706E FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_3BAE0AA7B1E7706E ON event (restaurant_id)');
        $this->addSql('ALTER TABLE historique_influence DROP CONSTRAINT fk_1b004f79fcfa10b');
        $this->addSql('DROP INDEX idx_1b004f79fcfa10b');
        $this->addSql('ALTER TABLE historique_influence RENAME COLUMN id_restaurant_id TO restaurant_id');
        $this->addSql('ALTER TABLE historique_influence ADD CONSTRAINT FK_1B004F79B1E7706E FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_1B004F79B1E7706E ON historique_influence (restaurant_id)');
        $this->addSql('ALTER TABLE notification DROP CONSTRAINT fk_bf5476cafcfa10b');
        $this->addSql('DROP INDEX idx_bf5476cafcfa10b');
        $this->addSql('ALTER TABLE notification RENAME COLUMN id_restaurant_id TO restaurant_id');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAB1E7706E FOREIGN KEY (restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_BF5476CAB1E7706E ON notification (restaurant_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event DROP CONSTRAINT FK_3BAE0AA7B1E7706E');
        $this->addSql('DROP INDEX IDX_3BAE0AA7B1E7706E');
        $this->addSql('ALTER TABLE event RENAME COLUMN restaurant_id TO id_restaurant_id');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT fk_3bae0aa7fcfa10b FOREIGN KEY (id_restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_3bae0aa7fcfa10b ON event (id_restaurant_id)');
        $this->addSql('ALTER TABLE historique_influence DROP CONSTRAINT FK_1B004F79B1E7706E');
        $this->addSql('DROP INDEX IDX_1B004F79B1E7706E');
        $this->addSql('ALTER TABLE historique_influence RENAME COLUMN restaurant_id TO id_restaurant_id');
        $this->addSql('ALTER TABLE historique_influence ADD CONSTRAINT fk_1b004f79fcfa10b FOREIGN KEY (id_restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_1b004f79fcfa10b ON historique_influence (id_restaurant_id)');
        $this->addSql('ALTER TABLE notification DROP CONSTRAINT FK_BF5476CAB1E7706E');
        $this->addSql('DROP INDEX IDX_BF5476CAB1E7706E');
        $this->addSql('ALTER TABLE notification RENAME COLUMN restaurant_id TO id_restaurant_id');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT fk_bf5476cafcfa10b FOREIGN KEY (id_restaurant_id) REFERENCES restaurant (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_bf5476cafcfa10b ON notification (id_restaurant_id)');
    }
}
