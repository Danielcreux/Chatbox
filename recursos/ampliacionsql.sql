DROP DATABASE IF EXISTS chatbox;

CREATE DATABASE chatbox
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'danielcreux'@'localhost' IDENTIFIED BY 'danielcreux';
GRANT ALL PRIVILEGES ON chatbox.* TO 'danielcreux'@'localhost';
FLUSH PRIVILEGES;

USE chatbox;

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CONVERSACIONES
-- =========================
CREATE TABLE conversaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =========================
-- MENSAJES
-- =========================
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversacion_id INT NOT NULL,
    rol ENUM('usuario','asistente') NOT NULL,
    contenido TEXT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE
);

-- =========================
-- FRASES BIENVENIDA
-- =========================
CREATE TABLE frases_bienvenida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    frase VARCHAR(512) NOT NULL,
    activa TINYINT(1) DEFAULT 1
);

INSERT INTO frases_bienvenida (frase, activa) VALUES
('Bienvenido a Chatbox.',1),
('Tu espacio está listo.',1),
('Empezamos cuando quieras.',1),
('¿Qué quieres construir hoy?',1),
('Listo para ayudarte.',1);

-- Usuario demo
INSERT INTO usuarios (username, password)
VALUES ('admin', 'admin');
