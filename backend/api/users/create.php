<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

// Only Admin can create other users directly
requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->role)
){
    // Validate Role
    $allowed_roles = ['customer', 'admin'];
    if(!in_array($data->role, $allowed_roles)){
        error_response("Invalid role. Allowed: customer, admin", 400);
    }

    try {
        // Check if email exists
        $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":email", $data->email);
        $checkStmt->execute();
        if($checkStmt->rowCount() > 0){
            error_response("Email already exists.", 409);
        }

        $query = "INSERT INTO users SET name=:name, email=:email, password_hash=:password_hash, role=:role";
        $stmt = $db->prepare($query);

        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $role = htmlspecialchars(strip_tags($data->role));
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password_hash", $password_hash);
        $stmt->bindParam(":role", $role);

        if($stmt->execute()){
            json_response(["message" => "User created successfully."]);
        } else {
            error_response("Unable to create user.", 503);
        }
    } catch (PDOException $e) {
        error_response($e->getMessage(), 500);
    }
} else {
    error_response("Incomplete data. Name, Email, Password, and Role are required.", 400);
}
?>
