const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Route pour envoyer un message au chat IA
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message requis'
      });
    }

    console.log(`💬 Nouveau message: "${message.substring(0, 50)}..."`);

    // Générer la réponse IA avec historique
    const aiResponse = await geminiService.generateResponse(
      message,
      conversationHistory || []
    );

    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la génération de la réponse'
    });
  }
});

// Route pour analyser un formulaire CERFA
router.post('/analyze-cerfa', async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Données du formulaire requises'
      });
    }

    console.log(`📋 Analyse CERFA pour: ${formData.natureProjet}`);

    // Analyser le formulaire avec Gemini
    const analysis = await geminiService.analyzeCerfaForm(formData);

    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur analyse CERFA:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse du formulaire'
    });
  }
});

// Route pour créer une nouvelle conversation (optionnel)
router.post('/conversation', async (req, res) => {
  try {
    const { title } = req.body;

    const conversationId = `conv_${Date.now()}`;
    
    res.json({
      success: true,
      data: {
        conversationId,
        title: title || 'Nouvelle conversation',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erreur création conversation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route pour récupérer l'historique des conversations (optionnel)
router.get('/conversations', async (req, res) => {
  try {
    // À implémenter avec Firestore si nécessaire
    res.json({
      success: true,
      data: {
        conversations: []
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération conversations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;