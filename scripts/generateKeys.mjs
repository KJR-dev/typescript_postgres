import crypto from 'crypto';
import fs from 'fs';

// Generate key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

// Export keys to PEM format
const privatePem = privateKey.export({ type: 'pkcs1', format: 'pem' });
const publicPem = publicKey.export({ type: 'pkcs1', format: 'pem' });

// Ensure the directory exists
fs.mkdirSync('certs', { recursive: true });

// Write keys to files
fs.writeFileSync('certs/private.pem', privatePem);
fs.writeFileSync('certs/public.pem', publicPem);

// eslint-disable-next-line no-undef
console.log('Keys generated and saved in certs/ directory.');
