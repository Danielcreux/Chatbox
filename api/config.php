<?php
session_start();
header('Content-Type: application/json');

$conexion = new mysqli(
    "localhost",
    "danielcreux",
    "danielcreux",
    "chatbox"
);

if ($conexion->connect_error) {
    echo json_encode(["error" => "Conexion fallida"]);
    exit();
}

$conexion->set_charset("utf8mb4");
