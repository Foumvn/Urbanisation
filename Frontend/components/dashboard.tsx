"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CerfaForm from "@/components/cerfa-form"
import {
  Building2,
  MessageSquare,
  Plus,
  Send,
  FileText,
  Map,
  CheckCircle,
  Clock,
  Settings,
  HelpCircle,
  User,
  Sparkles,
  LogOut,
  AlertCircle,
} from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "text" | "document" | "plan"
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  status: "active" | "completed" | "pending"
}

export default function DPAutoDashboard() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant IA spécialisé en urbanisme. Je vais vous aider à générer votre dossier de déclaration préalable. Pour commencer, pouvez-vous me décrire votre projet ?",
      timestamp: new Date(),
      type: "text",
    },
  ])

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Extension maison individuelle",
      lastMessage: "Génération des plans DP1 et DP2 terminée",
      timestamp: new Date(Date.now() - 3600000),
      status: "completed",
    },
    {
      id: "2",
      title: "Abri de jardin 15m²",
      lastMessage: "Vérification des règles PLU en cours...",
      timestamp: new Date(Date.now() - 7200000),
      status: "pending",
    },
    {
      id: "3",
      title: "Piscine hors-sol",
      lastMessage: "Formulaire CERFA généré avec succès",
      timestamp: new Date(Date.now() - 86400000),
      status: "completed",
    },
  ])

  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCerfaForm, setShowCerfaForm] = useState(false)
  const [error, setError] = useState("")
  const [userName, setUserName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Vérifier l'authentification
    const isAuthenticated = localStorage.getItem("dp-auto-authenticated")
    const userStr = localStorage.getItem("dp-auto-user")
    
    if (!isAuthenticated) {
      router.push("/login")
    } else if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.name || user.email || "Utilisateur")
      } catch (e) {
        console.error("Erreur parsing user:", e)
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("dp-auto-authenticated")
    localStorage.removeItem("dp-auto-user")
    router.push("/login")
  }

  const handleCerfaSubmit = async (formData: any) => {
    setShowCerfaForm(false)
    setError("")

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📋 Formulaire CERFA rempli pour : ${formData.natureProjet}\n👤 ${formData.nom} ${formData.prenom}\n📍 ${formData.adresseTravaux}\n📐 Surface: ${formData.surface}m²`,
      timestamp: new Date(),
      type: "document",
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/analyze-cerfa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      })

      const data = await response.json()

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data.analysis,
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        setError(data.error || "Erreur lors de l'analyse du formulaire")
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "❌ Désolé, je n'ai pas pu analyser votre formulaire. Veuillez réessayer.",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est lancé.")
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🔌 Je n'arrive pas à me connecter au serveur. Veuillez vérifier votre connexion.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    const messageToSend = currentInput
    setCurrentInput("")
    setIsLoading(true)
    setError("")

    try {
      // Préparer l'historique de conversation (derniers 10 messages)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data.message,
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        setError(data.error || "Erreur lors de la génération de la réponse")
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "❌ Désolé, une erreur s'est produite. Veuillez réessayer ou reformuler votre question.",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est lancé sur le port 3001.")
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🔌 Je n'arrive pas à me connecter au serveur. Assurez-vous que le backend est démarré.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "active":
        return <Sparkles className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 glass-sidebar flex flex-col">
        <div className="p-4 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg dp-auto-accent-gradient flex items-center justify-center floating">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">DP-Auto</h1>
              <p className="text-xs text-sidebar-foreground/60">Assistant IA Urbanisme</p>
            </div>
          </div>

          <Button
            className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground backdrop-blur-sm rounded-full"
            onClick={() => setShowCerfaForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau dossier DP
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <h2 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Dossiers récents</h2>
          </div>

          <ScrollArea className="flex-1 px-2">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="p-3 glass-card hover:bg-sidebar-accent/60 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-sidebar-accent-foreground line-clamp-1">{conv.title}</h3>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(conv.status)}`}>
                      {getStatusIcon(conv.status)}
                      <span className="ml-1 capitalize">
                        {conv.status === "completed" ? "Terminé" : conv.status === "pending" ? "En cours" : "Actif"}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-sidebar-accent-foreground/60 line-clamp-2 mb-2">{conv.lastMessage}</p>
                  <p className="text-xs text-sidebar-accent-foreground/40">
                    {conv.timestamp.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-sidebar-border/50">
          <div className="mb-3 px-2">
            <p className="text-xs text-sidebar-foreground/60 mb-1">Connecté en tant que</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive/60 hover:text-destructive"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="vscode-separator" />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/50 glass-message">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Assistant IA - Déclaration Préalable</h2>
              <p className="text-sm text-muted-foreground">Génération automatique de dossiers d'urbanisme</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                IA Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-4 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Erreur de connexion</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 modern-gradient-overlay">
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground backdrop-blur-sm rounded-full px-6 py-3"
                      : "glass-message rounded-2xl"
                  } p-4 transition-all duration-300 hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full dp-auto-accent-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-message rounded-2xl p-4 max-w-[80%]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full dp-auto-accent-gradient flex items-center justify-center">
                      <Building2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">L'assistant réfléchit...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Décrivez votre projet d'urbanisme (extension, abri, piscine...)..."
                  className="min-h-[44px] resize-none backdrop-blur-sm bg-background/80 border-border/50 rounded-full px-6"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className="h-[44px] px-6 bg-primary hover:bg-primary/90 backdrop-blur-sm rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowCerfaForm(true)}
                variant="outline"
                className="h-[44px] px-6 backdrop-blur-sm border-border/50 rounded-full"
                disabled={isLoading}
              >
                <FileText className="w-4 h-4 mr-2" />
                Formulaire CERFA
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Formulaires CERFA
                </span>
                <span className="flex items-center gap-1">
                  <Map className="w-3 h-3" />
                  Plans DP1, DP2, DP3
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Vérification PLU
                </span>
              </div>
              <span>Appuyez sur Entrée pour envoyer</span>
            </div>
          </div>
        </div>
      </div>

      {/* CERFA Form Modal */}
      {showCerfaForm && <CerfaForm onClose={() => setShowCerfaForm(false)} onSubmit={handleCerfaSubmit} />}
    </div>
  )
}