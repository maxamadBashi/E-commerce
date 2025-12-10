<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$admin = requireAuth($db, ['admin']);

// Total sales
$salesStmt = $db->prepare("SELECT COALESCE(SUM(total_amount),0) as total_sales FROM orders WHERE status IN ('pending','shipped','delivered')");
$salesStmt->execute();
$totalSales = $salesStmt->fetch(PDO::FETCH_ASSOC)['total_sales'];

// Most popular products
$popularStmt = $db->prepare("SELECT p.id, p.title, SUM(oi.quantity) as qty
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id, p.title
    ORDER BY qty DESC
    LIMIT 5");
$popularStmt->execute();
$popular = $popularStmt->fetchAll(PDO::FETCH_ASSOC);

// Stock alerts (low stock)
$stockStmt = $db->prepare("SELECT id, title, stock_quantity FROM products WHERE stock_quantity <= 5 ORDER BY stock_quantity ASC LIMIT 10");
$stockStmt->execute();
$lowStock = $stockStmt->fetchAll(PDO::FETCH_ASSOC);

json_response([
    'total_sales' => $totalSales,
    'popular_products' => $popular,
    'low_stock' => $lowStock
]);

