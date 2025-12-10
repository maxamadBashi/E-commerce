<?php

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload, string $secret) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $segments = [
        base64UrlEncode(json_encode($header)),
        base64UrlEncode(json_encode($payload))
    ];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, $secret, true);
    $segments[] = base64UrlEncode($signature);
    return implode('.', $segments);
}

function jwt_decode(string $jwt, string $secret) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        throw new Exception('Invalid token format');
    }

    [$b64Header, $b64Payload, $b64Signature] = $parts;
    $header = json_decode(base64UrlDecode($b64Header), true);
    $payload = json_decode(base64UrlDecode($b64Payload), true);

    if (empty($header['alg']) || $header['alg'] !== 'HS256') {
        throw new Exception('Unsupported algorithm');
    }

    $expected = base64UrlEncode(hash_hmac('sha256', "$b64Header.$b64Payload", $secret, true));
    if (!hash_equals($expected, $b64Signature)) {
        throw new Exception('Invalid signature');
    }

    if (isset($payload['exp']) && time() > $payload['exp']) {
        throw new Exception('Token expired');
    }

    return $payload;
}

