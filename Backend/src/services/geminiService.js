
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY manquante dans les variables d\'environnement');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });
    
    this.systemInstruction = `Tu es un expert en urbanisme français spécialisé dans les déclarations préalables de travaux.

TON RÔLE : Aider les utilisateurs à préparer leurs dossiers de déclaration préalable en répondant à leurs questions et en les guidant dans les démarches.

DOMAINES D'EXPERTISE :
- Règles d'urbanisme (PLU, POS, RNU)
- Formulaires CERFA (DP, PC, Permis d'aménager)
- Plans requis (DP1, DP2, DP3, DP4)
- Calculs de surfaces (SHON, SHAB, emprise au sol)
- Règles de recul, hauteur, implantation
- Déclarations préalables pour extensions, abris, piscines, clôtures, etc.

INSTRUCTIONS :
- Sois précis et technique mais pédagogique
- Cite les articles de loi quand c'est pertinent (Code de l'urbanisme)
- Donne des conseils pratiques pour remplir les formulaires
- Propose toujours l'étape suivante
- Si tu manques d'information, pose des questions précises (surface, localisation, etc.)
- Réponds en français de manière professionnelle et utile`;
  }

  async generateResponse(prompt, conversationHistory = []) {
    try {
      let history = [];
      
      if (conversationHistory && conversationHistory.length > 0) {
        history = conversationHistory
          .filter(msg => msg.role !== 'assistant' || msg.id !== '1')
          .map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }));

        if (history.length > 0 && history[0].role !== 'user') {
          history = history.slice(1);
        }
      }

      const fullPrompt = `${this.systemInstruction}\n\nQUESTION DE L'UTILISATEUR : ${prompt}`;

      if (history.length === 0) {
        const result = await this.model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();
        console.log('✅ Réponse Gemini générée avec succès');
        return text;
      }

      const chat = this.model.startChat({
        history: history,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      const result = await chat.sendMessage(fullPrompt);
      const response = result.response;
      const text = response.text();

      console.log('✅ Réponse Gemini générée avec succès');
      return text;
    } catch (error) {
      console.error('❌ Erreur Gemini:', error);
      throw new Error('Erreur lors de la génération de la réponse IA');
    }
  }

  async analyzeCerfaForm(formData) {
    try {
      const prompt = `Analyse ce formulaire CERFA pour un projet d'urbanisme :

📋 INFORMATIONS DU PROJET :
- Nature du projet: ${formData.natureProjet}
- Nom: ${formData.nom} ${formData.prenom}
- Adresse des travaux: ${formData.adresseTravaux}
- Surface du projet: ${formData.surface} m²
- Code postal: ${formData.codePostal || 'Non renseigné'}

📝 ANALYSE DEMANDÉE :
1. Liste des documents obligatoires à joindre au dossier
2. Vérifications PLU à effectuer pour cette commune
3. Calculs de surface à vérifier (emprise au sol, surface de plancher)
4. Recommandations spécifiques pour ce type de projet
5. Points de vigilance et erreurs fréquentes à éviter

Fournis une analyse détaillée et des conseils pratiques.`;

      const response = await this.generateResponse(prompt);
      console.log('✅ Analyse CERFA générée avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur analyse CERFA:', error);
      throw new Error('Erreur lors de l\'analyse du formulaire CERFA');
    }
  }
}

module.exports = new GeminiService();