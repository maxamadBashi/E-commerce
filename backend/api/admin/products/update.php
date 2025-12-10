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

$fields = [];
$params = [':id' => intval($data->id)];

if (isset($data->title)) { $fields[] = "title=:title"; $params[':title'] = htmlspecialchars(strip_tags($data->title)); }
if (isset($data->slug)) { $fields[] = "slug=:slug"; $params[':slug'] = htmlspecialchars(strip_tags($data->slug)); }
if (isset($data->description)) { $fields[] = "description=:description"; $params[':description'] = $data->description; }
if (isset($data->price)) { $fields[] = "price=:price"; $params[':price'] = floatval($data->price); }
if (isset($data->stock_quantity)) { $fields[] = "stock_quantity=:stock_quantity"; $params[':stock_quantity'] = intval($data->stock_quantity); }
if (isset($data->category_id)) { $fields[] = "category_id=:category_id"; $params[':category_id'] = intval($data->category_id); }
if (isset($data->image_url)) { $fields[] = "image_url=:image_url"; $params[':image_url'] = htmlspecialchars(strip_tags($data->image_url)); }

if (empty($fields)) {
    error_response('No fields to update', 400);
}

$sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
$stmt = $db->prepare($sql);

if ($stmt->execute($params)) {
    json_response(['message' => 'Product updated']);
}

error_response('Failed to update product', 500);

