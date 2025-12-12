<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

// Only Admin
requireAuth($db, ['admin']);

try {
    $query = "SELECT id, name, email, role, is_blocked, created_at FROM users ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["records" => $users]);
} catch (PDOException $e) {
    error_response($e->getMessage(), 500);
}
?>
