
require('dotenv').config();
const { auth } = require('./src/utils/firebase');

async function testFirebase() {
  try {
    console.log('🧪 Test de la configuration Firebase...\n');
    
    // Test 1: Vérifier la connexion
    const listUsersResult = await auth.listUsers(1);
    console.log('✅ Firebase Admin SDK configuré avec succès!');
    console.log(`📧 Compte de service: ${process.env.FIREBASE_CLIENT_EMAIL}`);
    
    // Test 2: Créer un utilisateur test
    const testEmail = `test${Date.now()}@test.com`;
    const userRecord = await auth.createUser({
      email: testEmail,
      password: '123456',
      displayName: 'Utilisateur Test'
    });
    
    console.log('✅ Utilisateur test créé:', userRecord.uid);
    
    // Test 3: Supprimer l'utilisateur test
    await auth.deleteUser(userRecord.uid);
    console.log('✅ Utilisateur test supprimé');
    
    console.log('\n🎉 Tous les tests Firebase sont passés!');
    
  } catch (error) {
    console.error('❌ Erreur Firebase:', error.message);
    console.error('Détails:', error);
  }
}

testFirebase();