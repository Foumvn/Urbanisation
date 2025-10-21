const { db } = require('../utils/firebase');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Configuration email
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class AuthService {
  // Inscription - Stockage direct dans Firestore
  static async signup(email, password, name) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const userDoc = await db.collection('users').doc(email).get();
      if (userDoc.exists) {
        throw new Error('Un compte existe déjà avec cet email');
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Générer un code de vérification
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Créer l'utilisateur dans Firestore
      const userData = {
        email: email,
        name: name,
        password: hashedPassword,
        emailVerified: false,
        verificationCode: verificationCode,
        verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      };

      await db.collection('users').doc(email).set(userData);

      // Envoyer l'email de vérification
      await this.sendVerificationEmail(email, verificationCode, name);

      return {
        success: true,
        user: {
          email: email,
          name: name,
          emailVerified: false
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  }

  // Connexion - Vérification réelle du mot de passe
  static async login(email, password) {
    try {
      // Récupérer l'utilisateur depuis Firestore
      const userDoc = await db.collection('users').doc(email).get();
      
      if (!userDoc.exists) {
        throw new Error('Aucun compte trouvé avec cet email');
      }

      const userData = userDoc.data();

      // Vérifier si l'email est vérifié
      if (!userData.emailVerified) {
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
      }

      // VÉRIFICATION DU MOT DE PASSE
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Générer un token de session (simple pour l'exemple)
      const sessionToken = this.generateSessionToken(email);

      // Mettre à jour la dernière connexion
      await db.collection('users').doc(email).update({
        lastLogin: new Date(),
        updatedAt: new Date(),
        sessionToken: sessionToken
      });

      return {
        success: true,
        token: sessionToken,
        user: {
          email: userData.email,
          name: userData.name,
          emailVerified: userData.emailVerified
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  }

  // Vérification du code
  static async verifyCode(email, code) {
    try {
      const userDoc = await db.collection('users').doc(email).get();
      
      if (!userDoc.exists) {
        throw new Error('Aucun compte trouvé avec cet email');
      }

      const userData = userDoc.data();

      // Vérifier le code et son expiration
      if (!userData.verificationCode) {
        throw new Error('Aucun code de vérification trouvé pour cet email');
      }

      if (new Date() > userData.verificationCodeExpires.toDate()) {
        throw new Error('Le code de vérification a expiré');
      }

      if (userData.verificationCode !== code) {
        throw new Error('Code de vérification incorrect');
      }

      // Marquer l'email comme vérifié
      await db.collection('users').doc(email).update({
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Email vérifié avec succès'
      };
    } catch (error) {
      console.error('Verify code error:', error);
      throw new Error(error.message);
    }
  }

  // Envoyer l'email de vérification
  static async sendVerificationEmail(email, code, name) {
    try {
      const mailOptions = {
        from: `"DP Auto" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Vérification de votre email - DP Auto',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #007bff; margin: 0;">DP Auto</h1>
              <p style="color: #666; margin: 5px 0;">Votre partenaire de confiance</p>
            </div>
            
            <h2 style="color: #333;">Bonjour ${name},</h2>
            <p>Merci de vous être inscrit sur DP Auto. Pour activer votre compte, veuillez utiliser le code de vérification suivant :</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #007bff;">
              <h1 style="color: #007bff; margin: 0; font-size: 36px; letter-spacing: 5px;">${code}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>⚠️ Important :</strong> Ce code expirera dans 15 minutes.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Si vous n'avez pas créé de compte sur DP Auto, veuillez ignorer cet email.
              </p>
            </div>
          </div>
        `
      };

      await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Email de vérification envoyé à ${email}`);
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
    }
  }

  // Générer un token de session simple
  static generateSessionToken(email) {
    return Buffer.from(`${email}:${Date.now()}`).toString('base64');
  }

  // Vérifier un token de session
  static async verifyToken(token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('ascii');
      const [email, timestamp] = decoded.split(':');
      
      const userDoc = await db.collection('users').doc(email).get();
      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      
      // Vérifier si le token correspond
      if (userData.sessionToken !== token) {
        return null;
      }

      return {
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified
      };
    } catch (error) {
      return null;
    }
  }

  // Régénérer un code de vérification
  static async resendVerificationCode(email) {
    try {
      const userDoc = await db.collection('users').doc(email).get();
      
      if (!userDoc.exists) {
        throw new Error('Aucun compte trouvé avec cet email');
      }

      const userData = userDoc.data();

      if (userData.emailVerified) {
        throw new Error('L\'email est déjà vérifié');
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      await db.collection('users').doc(email).update({
        verificationCode: verificationCode,
        verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
        updatedAt: new Date()
      });

      await this.sendVerificationEmail(email, verificationCode, userData.name);

      return {
        success: true,
        message: 'Nouveau code de vérification envoyé avec succès'
      };
    } catch (error) {
      console.error('Resend code error:', error);
      throw new Error(error.message);
    }
  }

  // Récupérer le profil utilisateur
  static async getProfile(email) {
    try {
      const userDoc = await db.collection('users').doc(email).get();
      
      if (!userDoc.exists) {
        throw new Error('Utilisateur non trouvé');
      }

      const userData = userDoc.data();
      
      return {
        success: true,
        user: {
          email: userData.email,
          name: userData.name,
          emailVerified: userData.emailVerified,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  }
}

module.exports = AuthService;