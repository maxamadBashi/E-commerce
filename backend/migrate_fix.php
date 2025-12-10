<?php
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // 1. Add 'is_blocked' to 'users' if not exists
    $columns = $db->query("SHOW COLUMNS FROM users LIKE 'is_blocked'")->fetchAll();
    if (empty($columns)) {
        $db->exec("ALTER TABLE users ADD COLUMN is_blocked TINYINT(1) DEFAULT 0 AFTER role");
        echo "Added 'is_blocked' column to users table.<br>";
    } else {
        echo "'is_blocked' column already exists.<br>";
    }

    // 2. Add 'role' to 'users' if not exists (handling possible enum issues)
     $columns = $db->query("SHOW COLUMNS FROM users LIKE 'role'")->fetchAll();
     if (empty($columns)) {
         $db->exec("ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin') DEFAULT 'customer' AFTER password_hash");
         echo "Added 'role' column to users table.<br>";
     } else {
         // Modify enum just in case
        $getType = $columns[0]['Type'];
        if (strpos($getType, 'admin') === false) {
             $db->exec("ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'admin') DEFAULT 'customer'");
             echo "Updated 'role' column enum.<br>";
        } else {
            echo "'role' column is up to date.<br>";
        }
     }

    // 3. Create 'orders' and 'order_items' tables if missing (minimal check)
    // ... skipping for now as login is the priority

    echo "Migration completed successfully.";

} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage();
}
?>
