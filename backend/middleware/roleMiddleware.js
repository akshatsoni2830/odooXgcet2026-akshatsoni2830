const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by authMiddleware)
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          error: {
            message: 'Authentication required',
            code: 'MISSING_AUTH'
          }
        });
      }

      // Check if user's role is in allowedRoles array
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: {
            message: 'Access denied',
            code: 'INSUFFICIENT_PERMISSIONS'
          }
        });
      }

      next();

    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        error: {
          message: 'An error occurred processing your request',
          code: 'INTERNAL_ERROR'
        }
      });
    }
  };
};

module.exports = roleMiddleware;
