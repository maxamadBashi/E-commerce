<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$admin = requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    error_response('Product id is required', 400);
}

$stmt = $db->prepare("DELETE FROM products WHERE id = :id");
$stmt->bindParam(':id', $data->id);

if ($stmt->execute()) {
    json_response(['message' => 'Product deleted']);
}

error_response('Failed to delete product', 500);

