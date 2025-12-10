<?php
include_once '../config/cors.php';
include_once '../middleware/auth.php';
include_once '../utils/response.php';

// Only admins can upload files
$user = requireAuth($db, ['admin']);

if ($_FILES['image']) {
    $targetDir = "../../uploads/";
    $fileName = basename($_FILES["image"]["name"]);
    // Unique filename to prevent overwrite
    $uniqueName = uniqid() . '_' . $fileName;
    $targetFilePath = $targetDir . $uniqueName;
    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

    $allowTypes = array('jpg', 'png', 'jpeg', 'gif', 'webp');
    if (in_array(strtolower($fileType), $allowTypes)) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
            // Return full URL
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            // Adjust path based on your project structure
            $url = "$protocol://$host/E-comerce/backend/uploads/$uniqueName";
            
            json_response(['message' => 'Image uploaded successfully.', 'url' => $url]);
        } else {
            error_response('Sorry, there was an error uploading your file.', 500);
        }
    } else {
        error_response('Sorry, only JPG, JPEG, PNG, GIF, & WEBP files are allowed to upload.', 400);
    }
} else {
    error_response('No file uploaded.', 400);
}
?>
