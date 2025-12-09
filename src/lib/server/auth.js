import jwt from 'jsonwebtoken';
import * as OTPAuth from 'otpauth';

/**
 * Hash a password using PBKDF2 (Web Crypto API)
 * @param {string} password 
 * @returns {Promise<string>} Format: "salt:hash" (hex)
 */
export async function hashPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a PBKDF2 hash
 * @param {string} storedHash Format: "salt:hash"
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(storedHash, password) {
    try {
        const [saltHex, hashHex] = storedHash.split(':');
        if (!saltHex || !hashHex) return false;

        const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        const hashBuffer = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const computedHashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        return computedHashHex === hashHex;
    } catch (e) {
        return false;
    }
}

/**
 * Generate a JWT token
 * @param {Object} payload 
 * @param {string} secret
 * @param {string|number} expiresIn 
 * @returns {string}
 */
export function generateToken(payload, secret, expiresIn = '1h') {
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify a JWT token
 * @param {string} token 
 * @param {string} secret
 * @returns {Object|null}
 */
export function verifyToken(token, secret) {
    if (!secret) {
        throw new Error('JWT_SECRET is not set');
    }
    try {
        return jwt.verify(token, secret);
    } catch (e) {
        return null;
    }
}

/**
 * Generate a new TOTP secret and URI
 * @param {string} username 
 * @returns {{secret: string, uri: string}}
 */
export function generateTOTPSecret(username) {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
        issuer: 'UFO Link Shortener',
        label: username,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
    });

    return {
        secret: secret.base32,
        uri: totp.toString()
    };
}

/**
 * Verify a TOTP token
 * @param {string} token 
 * @param {string} secret 
 * @returns {boolean}
 */
export function verifyTOTP(token, secret) {
    const totp = new OTPAuth.TOTP({
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
    });

    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
}
