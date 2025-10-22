"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Building2, Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Stocker les infos utilisateur
        localStorage.setItem("dp-auto-authenticated", "true")
        localStorage.setItem("dp-auto-user", JSON.stringify(data.data.user))
        
        // Redirection vers le dashboard
        router.push("/dashboard")
      } else {
        setError(data.error || "Erreur lors de la connexion")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est lancé.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner {
          animation: spin 2s linear infinite;
        }

        .pulse-ring {
          animation: pulse-ring 2s infinite;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>

      {/* État de chargement - Modal de connexion */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="fade-in">
            <Card className="glass-message p-8 max-w-sm mx-auto">
              <div className="flex flex-col items-center space-y-6">
                {/* Cercle pulsant avec spinner */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 bg-blue-100 rounded-full pulse-ring"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <div className="spinner">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Texte et détails */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Connexion en cours</h3>
                  <p className="text-sm text-muted-foreground">Vérification de vos identifiants...</p>
                </div>

                {/* Barre de progression */}
                <div className="w-full space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        style={{
                          animation: 'pulse 2s ease-in-out infinite',
                          width: '60%'
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Veuillez patienter...</p>
                </div>

                {/* Points d'animation */}
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full bg-blue-500"
                    style={{ animation: 'pulse 1s ease-in-out 0s infinite' }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full bg-blue-500"
                    style={{ animation: 'pulse 1s ease-in-out 0.2s infinite' }}
                  ></div>
                  <div 
                    className="w-2 h-2 rounded-full bg-blue-500"
                    style={{ animation: 'pulse 1s ease-in-out 0.4s infinite' }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Formulaire de connexion */}
      <div className={`w-full max-w-md ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dp-auto-accent-gradient mb-4 floating">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">DP-Auto</h1>
          <p className="text-muted-foreground">Automatisez vos démarches d'urbanisme avec l'IA</p>
        </div>

        <Card className="glass-message p-8 slide-up">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Se connecter</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-10 rounded-full"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 rounded-full"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-full h-12 text-base" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 mr-2 spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}