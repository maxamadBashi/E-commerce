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
    $query = "DELETE FROM products WHERE id = :id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":id", $data->id);

    if($stmt->execute()){
        if($stmt->rowCount() > 0) {
             json_response(["message" => "Product deleted."]);
        } else {
             error_response("Product not found.", 404);
        }
    } else {
        error_response("Unable to delete product.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
