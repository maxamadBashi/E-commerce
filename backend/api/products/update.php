<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if(empty($data->id)){
    error_response("Product ID is required.", 400);
}

try {
    $query = "UPDATE products SET 
                title=:title, 
                price=:price, 
                description=:description, 
                category_id=:category_id, 
                image_url=:image_url 
              WHERE id=:id";
    
    $stmt = $db->prepare($query);

    $title = htmlspecialchars(strip_tags($data->title));
    $price = htmlspecialchars(strip_tags($data->price));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : '';
    $category_id = htmlspecialchars(strip_tags($data->category_id));
    $image_url = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : '';
    $id = htmlspecialchars(strip_tags($data->id));

    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":price", $price);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":category_id", $category_id);
    $stmt->bindParam(":image_url", $image_url);
    $stmt->bindParam(":id", $id);

    if($stmt->execute()){
         json_response(["message" => "Product updated."]);
    } else {
        error_response("Unable to update product.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
