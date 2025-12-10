<?php
include_once __DIR__ . '/../utils/jwt.php';
include_once __DIR__ . '/../utils/response.php';

function getAuthConfig() {
    return include __DIR__ . '/../config/jwt.php';
}

function getBearerToken() {
    $headers = apache_request_headers();
    if (!$headers && function_exists('getallheaders')) {
        $headers = getallheaders();
    }
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    if (!$authHeader) {
        return null;
    }
    if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

function requireAuth(PDO $db, array $roles = []) {
    $token = getBearerToken();
    if (!$token) {
        error_response('Authorization header missing', 401);
    }

    $config = getAuthConfig();

    try {
        $payload = jwt_decode($token, $config['secret']);
    } catch (Exception $e) {
        error_response('Invalid token: ' . $e->getMessage(), 401);
    }

    $stmt = $db->prepare("SELECT id, name, email, role, is_blocked FROM users WHERE id = :id LIMIT 1");
    $stmt->bindParam(':id', $payload['sub']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        error_response('User not found', 401);
    }
    if (!empty($roles) && !in_array($user['role'], $roles)) {
        error_response('Forbidden', 403);
    }
    if (!empty($user['is_blocked'])) {
        error_response('User is blocked', 403);
    }

    return $user;
}

function issueToken(array $user) {
    $config = getAuthConfig();
    $now = time();
    $payload = [
        'iss' => $config['issuer'],
        'aud' => $config['audience'],
        'iat' => $now,
        'exp' => $now + $config['ttl'],
        'sub' => $user['id'],
        'role' => $user['role']
    ];
    return jwt_encode($payload, $config['secret']);
}

