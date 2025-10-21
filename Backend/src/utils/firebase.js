const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

// ✅ OPTION RECOMMANDÉE : Utiliser le fichier JSON directement
const serviceAccount = require('../../config/firebase-service-account.json');


const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

console.log('✅ Firebase configuré avec succès pour le projet:', serviceAccount.project_id);

module.exports = { db };