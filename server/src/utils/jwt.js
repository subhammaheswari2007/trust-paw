import jwt from 'jsonwebtoken';

const JWT_SECRET = () => process.env.JWT_SECRET || 'dev-fallback-secret';
const JWT_EXPIRY = () => process.env.JWT_EXPIRY || '7d';

/**
 * Sign a new JWT token.
 * @param {object} payload - Data to encode (typically { userId, email })
 * @returns {string} Signed JWT string
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn: JWT_EXPIRY() });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET());
}

/**
 * Decode a JWT token WITHOUT verifying the signature.
 * Used in demo/dev Google auth mode.
 * @param {string} token
 * @returns {object|null}
 */
export function decodeToken(token) {
  return jwt.decode(token);
}
