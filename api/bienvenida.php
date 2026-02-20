<?php
require "config.php";

$result = $conexion->query("
  SELECT frase
  FROM frases_bienvenida
  WHERE activa = 1
  ORDER BY RAND()
  LIMIT 1
");

$data=[];
while($row=$result->fetch_assoc()){
    $data[]=$row;
}

echo json_encode($data);
