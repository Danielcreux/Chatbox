<?php
require "config.php";

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "No autorizado"]);
    exit();
}


$conversacion_id = $_POST['conversacion_id'];
$mensaje_usuario = $_POST['mensaje'];

// Guardar mensaje usuario
$stmt = $conexion->prepare(
    "INSERT INTO mensajes (conversacion_id, rol, contenido) VALUES (?, 'usuario', ?)"
);
$stmt->bind_param("is", $conversacion_id, $mensaje_usuario);
$stmt->execute();

/* ===========================
   CONSULTA A OLLAMA
   =========================== */

$payload = json_encode([
    "model" => "gpt-oss:20b-cloud",
    "prompt" => $mensaje_usuario,
    "stream" => false
]);

$ch = curl_init("http://localhost:11434/api/generate");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$respuestaIA = $data["response"] ?? "Sin respuesta.";

/* ===========================
   GUARDAR RESPUESTA IA
   =========================== */

$stmt = $conexion->prepare(
    "INSERT INTO mensajes (conversacion_id, rol, contenido) VALUES (?, 'asistente', ?)"
);
$stmt->bind_param("is", $conversacion_id, $respuestaIA);
$stmt->execute();

echo json_encode([
    "ok" => true,
    "respuesta" => $respuestaIA
]);
