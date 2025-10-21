"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, FileText, Shield, Zap, ArrowRight, Users, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dp-auto-authenticated")
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl dp-auto-accent-gradient mx-auto mb-4 floating flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl dp-auto-accent-gradient flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">DP-Auto</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full">
                Se connecter
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Automatisez vos
          <span className="dp-auto-text-gradient"> déclarations préalables</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Générez vos dossiers de déclaration préalable en urbanisme grâce à l'intelligence artificielle. 
          Formulaires CERFA, plans, notice descriptive et dépôt numérique, en quelques clics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup" className="inline-flex">
            <Button size="lg" className="rounded-full h-12 px-8 text-base">
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base">
              Se connecter
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="glass-message p-6 text-center">
            <div className="w-12 h-12 rounded-xl dp-auto-accent-gradient mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Rapide</h3>
            <p className="text-sm text-muted-foreground">
              Générez votre dossier complet en moins de 10 minutes
            </p>
          </Card>

          <Card className="glass-message p-6 text-center">
            <div className="w-12 h-12 rounded-xl dp-auto-accent-gradient mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Conforme</h3>
            <p className="text-sm text-muted-foreground">
              Formulaires CERFA et documents aux normes en vigueur
            </p>
          </Card>

          <Card className="glass-message p-6 text-center">
            <div className="w-12 h-12 rounded-xl dp-auto-accent-gradient mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Complet</h3>
            <p className="text-sm text-muted-foreground">
              Plans, notices, formulaires et dépôt numérique inclus
            </p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Inscription</h3>
            <p className="text-sm text-muted-foreground">Créez votre compte en 30 secondes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">Décrivez votre projet simplement</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Génération</h3>
            <p className="text-sm text-muted-foreground">L'IA génère votre dossier complet</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Dépôt</h3>
            <p className="text-sm text-muted-foreground">Téléchargez et déposez en mairie</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="glass-message p-12 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
            Prêt à automatiser vos démarches ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoignez des centaines de professionnels et particuliers qui utilisent déjà DP-Auto
          </p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full h-12 px-8 text-base">
              Créer mon compte gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg dp-auto-accent-gradient flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">DP-Auto</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 DP-Auto. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}