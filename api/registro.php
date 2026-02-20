<?php
require "config.php";

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($username === '' || $password === '') {
    echo json_encode(["error" => "Campos vacíos"]);
    exit();
}

// Verificar si ya existe
$stmt = $conexion->prepare("SELECT id FROM usuarios WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Usuario ya existe"]);
    exit();
}

// Hash seguro
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conexion->prepare(
    "INSERT INTO usuarios (username, password) VALUES (?,?)"
);
$stmt->bind_param("ss", $username, $passwordHash);

if ($stmt->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["error" => "Error al crear usuario"]);
}
