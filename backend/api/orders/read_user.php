<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$user = requireAuth($db);

try {
    $query = "SELECT id, total_amount, status, created_at 
              FROM orders 
              WHERE user_id = :user_id
              ORDER BY created_at DESC";
              
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $orders]);
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
