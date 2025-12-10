<?php

function json_response($data, int $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function error_response(string $message, int $status = 400, array $extra = []) {
    json_response(array_merge(['message' => $message], $extra), $status);
}

