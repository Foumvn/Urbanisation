"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Building2, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [confirmationStep, setConfirmationStep] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStep(true)
        setError("")
      } else {
        setError(data.error || "Erreur lors de l'inscription")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur. Vérifiez que le backend est lancé.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setError("")
        setConfirmationStep(true)
        // Redirection automatique après 3 secondes
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.error || "Code de vérification incorrect")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setError("✅ Nouveau code envoyé ! Vérifiez votre email.")
      } else {
        setError(data.error || "Erreur lors de l'envoi du code")
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Erreur de connexion au serveur")
    }
  }

  // ÉTAPE DE CONFIRMATION
  if (confirmationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card className="glass-message p-8 text-center">
            {/* Icône de validation animée */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-24 h-24">
                {/* Cercle de fond animé */}
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
                {/* Cercle principal */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg" 
                     style={{
                       animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                     }}>
                  {/* Checkmark animé */}
                  <Check className="w-12 h-12 text-white" 
                          style={{
                            animation: 'drawCheck 0.6s ease-out 0.3s both',
                            strokeWidth: 3
                          }} />
                </div>
              </div>
            </div>

            <style>{`
              @keyframes scaleIn {
                from {
                  transform: scale(0);
                  opacity: 0;
                }
                to {
                  transform: scale(1);
                  opacity: 1;
                }
              }

              @keyframes drawCheck {
                from {
                  stroke-dasharray: 50;
                  stroke-dashoffset: 50;
                  opacity: 0;
                }
                to {
                  stroke-dasharray: 50;
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
              }

              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }

              .bounce-text {
                animation: bounce 2s infinite;
              }
            `}</style>

            <h2 className="text-3xl font-bold text-green-600 mb-2">Email vérifié !</h2>
            <p className="text-muted-foreground mb-2">Votre email a été confirmé avec succès.</p>
            
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-sm">
              ✅ Vous pouvez maintenant vous connecter à votre compte
            </div>

            <p className="text-sm text-muted-foreground mb-6 bounce-text">
              Redirection vers la connexion en cours...
            </p>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/login")} 
                className="w-full rounded-full h-12 text-base bg-green-600 hover:bg-green-700"
              >
                Aller à la connexion
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Link href="/signup">
                <Button variant="outline" className="w-full rounded-full h-12 text-base">
                  Créer un autre compte
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ÉTAPE DE VÉRIFICATION
  if (verificationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dp-auto-accent-gradient mb-4 floating">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">DP-Auto</h1>
            <p className="text-muted-foreground">Vérification de votre email</p>
          </div>

          <Card className="glass-message p-8">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">Vérifiez votre email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Nous avons envoyé un code de vérification à <strong>{email}</strong>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleVerification} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Code de vérification</label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="123456"
                  className="text-center text-lg font-mono rounded-full"
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={isLoading || !verificationCode}>
                {isLoading ? "Vérification..." : "Vérifier le code"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendCode}
                className="text-sm text-primary hover:underline font-medium"
                type="button"
              >
                Renvoyer le code
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setVerificationStep(false)
                  setVerificationCode("")
                  setError("")
                }}
                className="text-sm text-muted-foreground hover:underline"
                type="button"
              >
                Retour à l'inscription
              </button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ÉTAPE D'INSCRIPTION ORIGINALE
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dp-auto-accent-gradient mb-4 floating">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">DP-Auto</h1>
          <p className="text-muted-foreground">Automatisez vos démarches d'urbanisme avec l'IA</p>
        </div>

        <Card className="glass-message p-8">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6">Créer un compte</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="pl-10 rounded-full"
                  required
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 rounded-full"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full h-12 text-base" disabled={isLoading || !name || !email || !password}>
              {isLoading ? (
                "Création du compte..."
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  )
}