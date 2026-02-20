<?php
require "config.php";

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "No autorizado"]);
    exit();
}

$conversacion_id = $_GET['conversacion_id'];

$result = $conexion->query(
    "SELECT * FROM mensajes WHERE conversacion_id=$conversacion_id ORDER BY creado_en ASC"
);

$data=[];
while($row=$result->fetch_assoc()){
    $data[]=$row;
}

echo json_encode($data);
