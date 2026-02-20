<?php
require "config.php";

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

$stmt = $conexion->prepare("SELECT id, password FROM usuarios WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {

    if (password_verify($password, $user['password'])) {

        $_SESSION['usuario_id'] = $user['id'];

        echo json_encode([
            "ok" => true,
            "id" => $user['id']
        ]);

    } else {
        echo json_encode(["error" => "Contraseña incorrecta"]);
    }

} else {
    echo json_encode(["error" => "Usuario no existe"]);
}
