<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if(empty($data->name)){
    error_response("Category name is required.", 400);
}

try {
    $query = "INSERT INTO categories SET name=:name, description=:description";
    $stmt = $db->prepare($query);

    $name = htmlspecialchars(strip_tags($data->name));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : '';

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);

    if($stmt->execute()){
        json_response(["message" => "Category created.", "id" => $db->lastInsertId()], 201);
    } else {
        error_response("Unable to create category.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
