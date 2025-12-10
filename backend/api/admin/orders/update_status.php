<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$admin = requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id) || empty($data->status)) {
    error_response('Order id and status are required', 400);
}

$allowed = ['pending', 'shipped', 'delivered', 'cancelled'];
if (!in_array($data->status, $allowed)) {
    error_response('Invalid status', 400);
}

$stmt = $db->prepare("UPDATE orders SET status = :status, updated_at = NOW() WHERE id = :id");
$stmt->bindParam(':status', $data->status);
$stmt->bindParam(':id', $data->id);

if ($stmt->execute()) {
    json_response(['message' => 'Order status updated']);
}

error_response('Failed to update order status', 500);

