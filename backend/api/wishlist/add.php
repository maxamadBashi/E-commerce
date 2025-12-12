<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$user = requireAuth($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->product_id)){
    try {
        $query = "INSERT INTO wishlist (user_id, product_id) VALUES (:user_id, :product_id)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $user['id']);
        $stmt->bindParam(":product_id", $data->product_id);

        if($stmt->execute()){
            json_response(["message" => "Added to wishlist."]);
        }
    } catch (PDOException $e) {
        if($e->getCode() == 23000){
            // Duplicate entry
            json_response(["message" => "Already in wishlist."]);
        }
        error_response($e->getMessage(), 500);
    }
} else {
    error_response("Product ID required.", 400);
}
?>
