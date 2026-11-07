import { verifyToken } from '../utils/jwt.js';
import { JWT_COOKIE_NAME } from '../utils/constants.js';

/**
 * JWT authentication middleware.
 * Reads the session token from the HTTP-only cookie and attaches the
 * decoded payload to `req.user`.
 */
export function authenticate(req, res, next) {
  const token = req.cookies?.[JWT_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
