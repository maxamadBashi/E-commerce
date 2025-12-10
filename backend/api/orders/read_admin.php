<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

// Admin sees all
requireAuth($db, ['admin']);

try {
    $query = "SELECT o.id, o.user_id, u.name as user_name, o.total_amount, o.status, o.created_at 
              FROM orders o
              LEFT JOIN users u ON o.user_id = u.id
              ORDER BY o.created_at DESC";
              
    $stmt = $db->prepare($query);
    $stmt->execute();

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $orders]);
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
