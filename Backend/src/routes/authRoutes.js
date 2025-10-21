
const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { validateSignup, validateLogin, validateVerifyCode } = require('../utils/validators');
const authMiddleware = require('../utils/authMiddleware');

// Route d'inscription
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const result = await AuthService.signup(email, password, name);
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès. Un code de vérification a été envoyé à votre email.',
      data: result.user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Route de connexion
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await AuthService.login(email, password);
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: result.user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// Route de vérification du code
router.post('/verify-code', validateVerifyCode, async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const result = await AuthService.verifyCode(email, code);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Route pour renvoyer le code de vérification
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email requis'
      });
    }
    
    const result = await AuthService.resendVerificationCode(email);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Route protégée - profil utilisateur
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du profil'
    });
  }
});

// Route pour vérifier si l'utilisateur est authentifié
router.get('/check-auth', authMiddleware, async (req, res) => {
  res.json({
    success: true,
    data: {
      authenticated: true,
      user: req.user
    }
  });
});

module.exports = router;