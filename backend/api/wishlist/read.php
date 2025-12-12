<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$user = requireAuth($db);

try {
    $query = "SELECT p.*, w.created_at as saved_at 
              FROM wishlist w
              JOIN products p ON w.product_id = p.id
              WHERE w.user_id = :user_id
              ORDER BY w.created_at DESC";
              
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $products]);
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
