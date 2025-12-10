<?php
// JWT configuration
return [
    'secret' => 'change-this-secret-in-production-very-long-string',
    'issuer' => 'ecommerce-api',
    'audience' => 'ecommerce-client',
    'ttl' => 60 * 60 * 4 // 4 hours
];

