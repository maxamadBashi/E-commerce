<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT id, name, description, created_at FROM categories ORDER BY name ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $categories]);
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
