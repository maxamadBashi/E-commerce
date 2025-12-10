<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$admin = requireAuth($db, ['admin']);

$query = "SELECT o.id, o.user_id, u.name as customer_name, o.total_amount, o.status, o.created_at, o.updated_at
          FROM orders o
          LEFT JOIN users u ON u.id = o.user_id
          ORDER BY o.created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
json_response(['records' => $orders]);

