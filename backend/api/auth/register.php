<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(
    empty($data->name) ||
    empty($data->email) ||
    empty($data->password)
){
    error_response("Unable to register user. Data is incomplete.", 400);
}

$query = "INSERT INTO users SET name=:name, email=:email, password_hash=:password, phone=:phone, role='customer'";
$stmt = $db->prepare($query);

$name = htmlspecialchars(strip_tags($data->name));
$email = htmlspecialchars(strip_tags($data->email));
$password = password_hash($data->password, PASSWORD_BCRYPT);
$phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : '';

$stmt->bindParam(":name", $name);
$stmt->bindParam(":email", $email);
$stmt->bindParam(":password", $password);
$stmt->bindParam(":phone", $phone);

if($stmt->execute()){
    $userId = $db->lastInsertId();
    $token = issueToken(['id' => $userId, 'role' => 'customer']);
    json_response([
        "message" => "User was registered.",
        "token" => $token,
        "user" => [
            "id" => $userId,
            "name" => $name,
            "email" => $email,
            "role" => "customer"
        ]
    ], 201);
} else {
    error_response("Unable to register user. Email might be duplicate.", 503);
}
?>
