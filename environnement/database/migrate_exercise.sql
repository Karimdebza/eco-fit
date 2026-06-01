-- Migration : remplacement de la table exercise pour free-exercise-db
-- À exécuter UNE SEULE FOIS sur ta BDD existante

-- 1. Supprimer la contrainte FK de programme_exercise
ALTER TABLE `programme_exercise` DROP FOREIGN KEY `programme_exercise_ibfk_2`;

-- 2. Vider et recréer la table exercise
DROP TABLE IF EXISTS `exercise`;

CREATE TABLE `exercise` (
  `id_exercise`       INT           NOT NULL AUTO_INCREMENT,
  `slug`              VARCHAR(200)  NOT NULL UNIQUE,
  `name`              VARCHAR(200)  NOT NULL,
  `category`          VARCHAR(50)   DEFAULT NULL,
  `level`             VARCHAR(20)   DEFAULT NULL,
  `force`             VARCHAR(20)   DEFAULT NULL,
  `mechanic`          VARCHAR(30)   DEFAULT NULL,
  `equipment`         VARCHAR(50)   DEFAULT NULL,
  `primary_muscles`   TEXT          DEFAULT NULL,
  `secondary_muscles` TEXT          DEFAULT NULL,
  `instructions`      LONGTEXT      DEFAULT NULL,
  `images`            TEXT          DEFAULT NULL,
  PRIMARY KEY (`id_exercise`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Remettre la FK sur programme_exercise
ALTER TABLE `programme_exercise`
  ADD CONSTRAINT `programme_exercise_ibfk_2`
  FOREIGN KEY (`id_exercise`) REFERENCES `exercise` (`id_exercise`);
