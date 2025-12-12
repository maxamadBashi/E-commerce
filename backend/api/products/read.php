<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

try {
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : '';

    $query = "SELECT p.*, c.name as category_name 
              FROM products p 
              LEFT JOIN categories c ON p.category_id = c.id 
              WHERE 1=1";

    if (!empty($search)) {
        $query .= " AND (p.title LIKE :search OR p.description LIKE :search)";
    }

    if (!empty($category_id)) {
        $query .= " AND p.category_id = :category_id";
    }

    $query .= " ORDER BY p.created_at DESC";

    $stmt = $db->prepare($query);

    if (!empty($search)) {
        $searchTerm = "%{$search}%";
        $stmt->bindParam(':search', $searchTerm);
    }

    if (!empty($category_id)) {
        $stmt->bindParam(':category_id', $category_id);
    }

    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $products]);

} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
