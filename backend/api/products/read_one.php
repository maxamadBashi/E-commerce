<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$id = isset($_GET['id']) ? $_GET['id'] : die();

try {
    $query = "SELECT p.*, c.name as category_name 
              FROM products p 
              LEFT JOIN categories c ON p.category_id = c.id 
              WHERE p.id = :id 
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        json_response($product);
    } else {
        error_response("Product not found.", 404);
    }
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
