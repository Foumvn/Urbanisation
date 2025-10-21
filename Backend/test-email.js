require('dotenv').config();

async function testEmail() {
  try {
    console.log('🧪 Test de l\'envoi d\'email...\n');
    
    // Import dynamique pour éviter les erreurs de circular dependency
    const AuthService = require('./src/services/authService');
    
    await AuthService.sendVerificationEmail(
      'votre-email-de-test@gmail.com', 
      '123456', 
      'John Doe'
    );
    
    console.log('✅ Email envoyé avec succès!');
    console.log('📨 Vérifiez votre boîte mail (spam aussi)');
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    console.error('Détails:', error);
  }
}

testEmail();