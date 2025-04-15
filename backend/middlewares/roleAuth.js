// middleware/roleAuth.js
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      const user = req.user; // req.user must be set earlier by authentication middleware
  
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: No user info' });
      }
  
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient role' });
      }
  
      next();
    };
  }
  
  module.exports = authorizeRoles;
  