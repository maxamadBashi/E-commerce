<?php
include_once '../config/cors.php';
include_once '../middleware/auth.php';
include_once '../utils/response.php';

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Only admins can upload files
$user = requireAuth($db, ['admin']);

try {
    if (isset($_FILES['image'])) {
        $targetDir = "../uploads/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }
        
        $fileName = basename($_FILES["image"]["name"]);
        $uniqueName = uniqid() . '_' . $fileName;
        $targetFilePath = $targetDir . $uniqueName;
        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
    
        $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp');
        if (in_array(strtolower($fileType), $allowTypes)) {
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
                $host = $_SERVER['HTTP_HOST'];
                // Adjust path: localhost/E-comerce/backend/uploads/filename
                $url = "$protocol://$host/E-comerce/backend/uploads/$uniqueName";
                
                json_response(['message' => 'Image uploaded successfully.', 'url' => $url]);
            } else {
                error_response('Sorry, there was an error uploading your file. Check permissions.', 500);
            }
        } else {
            error_response('Sorry, only JPG, JPEG, PNG, GIF, & WEBP files are allowed to upload.', 400);
        }
    } else {
        error_response('No file uploaded.', 400);
    }
} catch (Exception $e) {
    error_response($e->getMessage(), 500);
}
?>
