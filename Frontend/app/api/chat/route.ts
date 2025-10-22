import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  // Add system prompt for DP-Auto urbanisme context
  const systemPrompt = {
    role: "system" as const,
    content: `Tu es un assistant IA spécialisé en urbanisme français, expert en déclarations préalables (DP). 
    Tu aides les utilisateurs à :
    - Comprendre les règles d'urbanisme applicables à leur projet
    - Générer les formulaires CERFA nécessaires
    - Créer les plans obligatoires (DP1, DP2, DP3, etc.)
    - Vérifier la conformité avec le PLU local
    - Rédiger la notice descriptive
    - Préparer le dossier complet pour dépôt en mairie
    
    Sois précis, professionnel et pédagogue. Demande toujours les informations essentielles : 
    localisation, nature du projet, surfaces, matériaux, etc.`,
  }

  const result = streamText({
    model: "openai/gpt-5",
    messages: [systemPrompt, ...prompt],
    abortSignal: req.signal,
    maxOutputTokens: 2000,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
