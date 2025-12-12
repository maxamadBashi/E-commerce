<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$user = requireAuth($db);

$product_id = isset($_GET['product_id']) ? $_GET['product_id'] : die();

try {
    $query = "DELETE FROM wishlist WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->bindParam(":product_id", $product_id);

    if($stmt->execute()){
        json_response(["message" => "Removed from wishlist."]);
    } else {
        error_response("Unable to remove.", 503);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
