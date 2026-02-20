<?php
require "config.php";

if(!isset($_SESSION['usuario_id'])){
    echo json_encode(["error"=>"No autorizado"]);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];


$result = $conexion->query(
    "SELECT * FROM conversaciones WHERE usuario_id=$usuario_id ORDER BY creado_en DESC"
);

$data=[];
while($row=$result->fetch_assoc()){
    $data[]=$row;
}

echo json_encode($data);
