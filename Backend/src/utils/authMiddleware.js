const AuthService = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification manquant'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    const user = await AuthService.verifyToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }
    
    // Attach user info to request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
};

module.exports = authMiddleware;