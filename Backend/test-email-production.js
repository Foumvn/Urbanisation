
require('dotenv').config();
const AuthService = require('./src/services/authService');

async function testEmailProduction() {
  console.log('🧪 TEST ENVOI EMAIL PRODUCTION\n');
  
  try {
    // Test avec un email réel
    await AuthService.sendVerificationEmail(
      'fredyfoumvn237@gmail.com', // Votre email
      '123456', 
      'Fredy Foum'
    );
    
    console.log('✅ Email envoyé avec succès!');
    console.log('📧 Vérifiez votre boîte mail (spam aussi)');
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    console.log('\n🔧 Vérifiez :');
    console.log('1. EMAIL_USER dans .env');
    console.log('2. EMAIL_PASSWORD (mot de passe app Gmail)');
    console.log('3. Validation 2 étapes activée');
  }
}

testEmailProduction();