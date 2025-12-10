<?php
include_once '../../../config/cors.php';
include_once '../../../config/database.php';
include_once '../../../middleware/auth.php';
include_once '../../../utils/response.php';

$database = new Database();
$db = $database->getConnection();
$user = requireAuth($db, ['customer']);

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['items']) || !is_array($data['items'])) {
    error_response('Items are required', 400);
}

try {
    $db->beginTransaction();

    $total = 0;
    $prepared = $db->prepare("SELECT id, price, stock_quantity FROM products WHERE id = :id FOR UPDATE");
    $updateStock = $db->prepare("UPDATE products SET stock_quantity = stock_quantity - :qty WHERE id = :id");
    $insertOrderItem = $db->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :qty, :price)");

    // Create order shell
    $orderStmt = $db->prepare("INSERT INTO orders (user_id, total_amount, status) VALUES (:uid, 0, 'pending')");
    $orderStmt->bindParam(':uid', $user['id']);
    $orderStmt->execute();
    $orderId = $db->lastInsertId();

    foreach ($data['items'] as $item) {
        $pid = intval($item['product_id'] ?? 0);
        $qty = intval($item['quantity'] ?? 0);
        if ($pid <= 0 || $qty <= 0) {
            throw new Exception('Invalid item payload');
        }

        $prepared->bindParam(':id', $pid);
        $prepared->execute();
        $product = $prepared->fetch(PDO::FETCH_ASSOC);
        if (!$product) {
            throw new Exception("Product {$pid} not found");
        }
        if ($product['stock_quantity'] < $qty) {
            throw new Exception("Insufficient stock for product {$pid}");
        }

        $lineTotal = $product['price'] * $qty;
        $total += $lineTotal;

        $updateStock->bindParam(':qty', $qty);
        $updateStock->bindParam(':id', $pid);
        $updateStock->execute();

        $insertOrderItem->execute([
            ':order_id' => $orderId,
            ':product_id' => $pid,
            ':qty' => $qty,
            ':price' => $product['price']
        ]);
    }

    $updateOrder = $db->prepare("UPDATE orders SET total_amount = :total WHERE id = :id");
    $updateOrder->bindParam(':total', $total);
    $updateOrder->bindParam(':id', $orderId);
    $updateOrder->execute();

    $db->commit();

    json_response(['message' => 'Order created', 'order_id' => $orderId, 'total' => $total], 201);
} catch (Exception $e) {
    $db->rollBack();
    error_response('Checkout failed: ' . $e->getMessage(), 400);
}

