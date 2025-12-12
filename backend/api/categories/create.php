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
    $query = "INSERT INTO categories SET name=:name, slug=:slug";
    $stmt = $db->prepare($query);

    $name = htmlspecialchars(strip_tags($data->name));
    // simple slug from name
    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
    $slug = trim($slug, '-');

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":slug", $slug);

    if($stmt->execute()){
        json_response(["message" => "Category created.", "id" => $db->lastInsertId()], 201);
    } else {
        error_response("Unable to create category.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
