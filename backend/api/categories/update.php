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

if (!empty($data->id) && !empty($data->name)) {
    try {
        // Slugify
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->name)));

        $query = "UPDATE categories SET name = :name, slug = :slug WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":slug", $slug);
        $stmt->bindParam(":id", $data->id);

        if ($stmt->execute()) {
            json_response(["message" => "Category updated successfully."]);
        } else {
            error_response("Unable to update category.", 503);
        }
    } catch (PDOException $e) {
        error_response($e->getMessage(), 500);
    }
} else {
    error_response("Incomplete data.", 400);
}
?>
