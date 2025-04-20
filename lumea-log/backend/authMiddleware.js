// authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // 1. Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // 2. Typically "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token error" });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatted" });
  }

  // 3. Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalid" });
    }

    // 4. Attach user info to req (for later use)
    req.userId = decoded.id;
    next();
  });
}

module.exports = authMiddleware;
