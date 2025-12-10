<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $data = json_decode(file_get_contents("php://input"));

    if(empty($data->email) || empty($data->password)){
        error_response("Incomplete data.", 400);
    }

    $query = "SELECT id, name, email, password_hash, role, is_blocked FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$user || !password_verify($data->password, $user['password_hash'])){
        // Use generic message for security, or specific for debug
        error_response("Invalid credentials.", 401);
    }

    if(!empty($user['is_blocked'])){
        error_response("User is blocked.", 403);
    }

    $token = issueToken($user);

    json_response([
        "message" => "Login successful.",
        "token" => $token,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]);

} catch (Exception $e) {
    error_response($e->getMessage(), 500);
}
?>
