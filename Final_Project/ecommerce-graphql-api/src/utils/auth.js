const jwt = require('jsonwebtoken');

// Helper to get user from the 'Authorization: Bearer <token>' header
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Get token after 'Bearer'
    if (!token) return null;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload.userId; // We stored userId in the token payload
    } catch (err) {
      return null; // Token is invalid or expired
    }
  }
  return null;
};

module.exports = { getUserFromToken };