<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$admin = requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->title) || !isset($data->price)) {
    error_response('Title and price are required', 400);
}

$query = "INSERT INTO products (title, slug, description, price, stock_quantity, category_id, image_url) 
          VALUES (:title, :slug, :description, :price, :stock, :category_id, :image_url)";
$stmt = $db->prepare($query);

$title = htmlspecialchars(strip_tags($data->title));
$slug = isset($data->slug) ? htmlspecialchars(strip_tags($data->slug)) : strtolower(preg_replace('/\s+/', '-', $title));
$description = isset($data->description) ? $data->description : '';
$price = floatval($data->price);
$stock = isset($data->stock_quantity) ? intval($data->stock_quantity) : 0;
$categoryId = isset($data->category_id) ? intval($data->category_id) : null;
$imageUrl = isset($data->image_url) ? htmlspecialchars(strip_tags($data->image_url)) : null;

$stmt->bindParam(':title', $title);
$stmt->bindParam(':slug', $slug);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':price', $price);
$stmt->bindParam(':stock', $stock);
$stmt->bindParam(':category_id', $categoryId);
$stmt->bindParam(':image_url', $imageUrl);

if ($stmt->execute()) {
    json_response([
        'message' => 'Product created',
        'id' => $db->lastInsertId()
    ], 201);
}

error_response('Failed to create product', 500);

