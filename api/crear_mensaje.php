<?php
require "config.php";

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "No autorizado"]);
    exit();
}

$conversacion_id = $_POST['conversacion_id'];
$rol = $_POST['rol'];
$contenido = $_POST['contenido'];

$conexion->query(
    "UPDATE conversaciones 
     SET creado_en = NOW() 
     WHERE id=$conversacion_id"
);
$stmt = $conexion->prepare(
    "INSERT INTO mensajes (conversacion_id, rol, contenido) VALUES (?,?,?)"
);
$stmt->bind_param("iss", $conversacion_id, $rol, $contenido);
$stmt->execute();

echo json_encode(["ok"=>true]);
