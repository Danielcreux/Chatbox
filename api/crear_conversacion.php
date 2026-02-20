<?php
require "config.php";

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "No autorizado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];
$titulo = trim($_POST['titulo'] ?? '');

$stmt = $conexion->prepare(
    "INSERT INTO conversaciones (usuario_id, titulo) VALUES (?,?)"
);
$stmt->bind_param("is", $usuario_id, $titulo);
$stmt->execute();

echo json_encode([
    "ok" => true,
    "id" => $stmt->insert_id
]);
