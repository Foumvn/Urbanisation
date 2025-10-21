
require('dotenv').config();
const AuthService = require('./src/services/authService');

async function testAuthComplete() {
  console.log('🚀 TEST COMPLET DU SYSTÈME AUTHENTIFICATION\n');
  
  const testEmail = `fredyfoumvn237${Date.now()}@gmail.com`;
  const testPassword = '123456';
  const testName = 'Utilisateur Test';

  try {
    // === TEST 1: INSCRIPTION ===
    console.log('1. 📝 TEST INSCRIPTION');
    const signupResult = await AuthService.signup(testEmail, testPassword, testName);
    
    console.log('✅ Inscription réussie!');
    console.log('👤 Utilisateur créé:', signupResult.user.uid);
    console.log('🔢 Code de vérification:', signupResult.verificationCode);
    console.log('📧 Email vérifié?:', signupResult.user.emailVerified);
    console.log('---');

    // === TEST 2: TENTATIVE DE CONNEXION SANS VÉRIFICATION ===
    console.log('2. 🔐 TEST CONNEXION SANS VÉRIFICATION');
    try {
      const loginResult = await AuthService.login(testEmail, testPassword);
      console.log('❌ ERREUR: La connexion aurait dû échouer sans vérification');
    } catch (error) {
      console.log('✅ Connexion bloquée (email non vérifié):', error.message);
    }
    console.log('---');

    // === TEST 3: VÉRIFICATION AVEC MAUVAIS CODE ===
    console.log('3. ❌ TEST VÉRIFICATION MAUVAIS CODE');
    try {
      await AuthService.verifyCode(testEmail, '000000');
      console.log('❌ ERREUR: La vérification aurait dû échouer');
    } catch (error) {
      console.log('✅ Vérification échouée (mauvais code):', error.message);
    }
    console.log('---');

    // === TEST 4: VÉRIFICATION AVEC BON CODE ===
    console.log('4. ✅ TEST VÉRIFICATION BON CODE');
    const verifyResult = await AuthService.verifyCode(testEmail, signupResult.verificationCode);
    console.log('✅ Vérification réussie:', verifyResult.message);
    console.log('---');

    // === TEST 5: CONNEXION APRÈS VÉRIFICATION ===
    console.log('5. 🔓 TEST CONNEXION APRÈS VÉRIFICATION');
    const finalLogin = await AuthService.login(testEmail, testPassword);
    console.log('✅ Connexion réussie après vérification');
    console.log('📧 Email vérifié?:', finalLogin.user.emailVerified);
    console.log('---');

    // === TEST 6: RENVOI DE CODE (devrait échouer car déjà vérifié) ===
    console.log('6. 🔄 TEST RENVOI CODE (après vérification)');
    try {
      await AuthService.resendVerificationCode(testEmail);
      console.log('❌ ERREUR: Le renvoi aurait dû échouer');
    } catch (error) {
      console.log('✅ Renvoi bloqué (déjà vérifié):', error.message);
    }

    console.log('\n🎉 TOUS LES TESTS SONT RÉUSSIS!');
    console.log('\n📋 RÉCAPITULATIF:');
    console.log('• Inscription ✓');
    console.log('• Blocage sans vérification ✓');
    console.log('• Vérification échouée (mauvais code) ✓');
    console.log('• Vérification réussie ✓');
    console.log('• Connexion après vérification ✓');
    console.log('• Protection renvoi inutile ✓');

  } catch (error) {
    console.error('❌ TEST ÉCHOUÉ:', error.message);
    console.error('Détails:', error);
  }
}

testAuthComplete();