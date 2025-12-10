<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT p.id, p.title, p.price, p.description, p.image_url, c.name as category_name 
          FROM products p 
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$num = $stmt->rowCount();

if($num > 0){
    $products_arr = array();
    $products_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $product_item = array(
            "id" => $id,
            "title" => $title,
            "description" => html_entity_decode($description),
            "price" => $price,
            "category_name" => $category_name,
            "image_url" => $image_url
        );
        array_push($products_arr["records"], $product_item);
    }
    http_response_code(200);
    echo json_encode($products_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No products found."));
}
?>
