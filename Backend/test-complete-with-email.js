
require('dotenv').config();
const AuthService = require('./src/services/authService');

async function testCompleteWithEmail() {
  console.log('🚀 TEST COMPLET AVEC ENVOI EMAIL\n');
  
  const testEmail = 'fredyfoumvn237@gmail.com'; // Votre vrai email
  const testPassword = '123456';
  const testName = 'Fredy Foum';

  try {
    // === TEST 1: INSCRIPTION AVEC ENVOI EMAIL ===
    console.log('1. 📝 INSCRIPTION ET ENVOI EMAIL');
    const signupResult = await AuthService.signup(testEmail, testPassword, testName);
    
    console.log('✅ Inscription réussie!');
    console.log('👤 Utilisateur créé:', signupResult.user.uid);
    console.log('📧 Email de vérification envoyé à:', testEmail);
    console.log('⏰ Le code expire dans 15 minutes');
    console.log('---');

    console.log('📨 Vérifiez votre email et entrez le code reçu');
    console.log('💡 Le code sera dans le email de DP Auto');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('email déjà existant')) {
      console.log('💡 Utilisez un email différent ou supprimez l\'utilisateur dans Firebase Console');
    }
  }
}

testCompleteWithEmail();