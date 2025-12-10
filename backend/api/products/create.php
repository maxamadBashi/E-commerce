<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if(
    empty($data->title) ||
    empty($data->price) ||
    empty($data->category_id)
){
    error_response("Incomplete data. Title, price, and category are required.", 400);
}

try {
    $query = "INSERT INTO products SET 
                title=:title, 
                price=:price, 
                description=:description, 
                category_id=:category_id, 
                image_url=:image_url";
    
    $stmt = $db->prepare($query);

    $title = htmlspecialchars(strip_tags($data->title));
    $price = htmlspecialchars(strip_tags($data->price));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : '';
    $category_id = htmlspecialchars(strip_tags($data->category_id));
    $image_url = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : '';

    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":price", $price);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":category_id", $category_id);
    $stmt->bindParam(":image_url", $image_url);

    if($stmt->execute()){
        json_response(["message" => "Product created.", "id" => $db->lastInsertId()], 201);
    } else {
        error_response("Unable to create product.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
