/* Пол */
ALTER TABLE users ADD COLUMN sex TINYINT(1) NOT NULL DEFAULT 0;
/* Фотография */
ALTER TABLE users ADD COLUMN photo50 VARCHAR(512) NOT NULL DEFAULT '';