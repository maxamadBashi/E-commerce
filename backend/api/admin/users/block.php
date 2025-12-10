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
    error_response('User id is required', 400);
}

$stmt = $db->prepare("UPDATE users SET is_blocked = 1 WHERE id = :id AND role = 'customer'");
$stmt->bindParam(':id', $data->id);

if ($stmt->execute()) {
    json_response(['message' => 'User blocked']);
}

error_response('Failed to block user', 500);

