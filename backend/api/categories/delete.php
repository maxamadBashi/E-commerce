<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../middleware/auth.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

// Only Admin
requireAuth($db, ['admin']);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $query = "DELETE FROM categories WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);

        if ($stmt->execute()) {
            json_response(["message" => "Category deleted successfully."]);
        } else {
            error_response("Unable to delete category.", 503);
        }
    } catch (PDOException $e) {
        error_response("Unable to delete category. It might be linked to products.", 500);
    }
} else {
    error_response("Missing ID.", 400);
}
?>
