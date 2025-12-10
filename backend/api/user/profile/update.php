<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$user = requireAuth($db, ['customer']);

$data = json_decode(file_get_contents("php://input"));

$fields = [];
$params = [':id' => $user['id']];

if (isset($data->name)) { $fields[] = "name=:name"; $params[':name'] = htmlspecialchars(strip_tags($data->name)); }
if (isset($data->phone)) { $fields[] = "phone=:phone"; $params[':phone'] = htmlspecialchars(strip_tags($data->phone)); }
if (isset($data->password) && !empty($data->password)) { $fields[] = "password_hash=:password_hash"; $params[':password_hash'] = password_hash($data->password, PASSWORD_BCRYPT); }

if (empty($fields)) {
    error_response('No fields to update', 400);
}

$sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
$stmt = $db->prepare($sql);

if ($stmt->execute($params)) {
    json_response(['message' => 'Profile updated']);
}

error_response('Failed to update profile', 500);

