<?php
require "config.php";

$id = $_POST['id'];

$stmt = $conexion->prepare("DELETE FROM conversaciones WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["ok"=>true]);
