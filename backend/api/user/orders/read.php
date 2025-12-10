<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$user = requireAuth($db, ['customer']);

$stmt = $db->prepare("SELECT id, total_amount, status, created_at FROM orders WHERE user_id = :uid ORDER BY created_at DESC");
$stmt->bindParam(':uid', $user['id']);
$stmt->execute();

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
json_response(['records' => $orders]);

