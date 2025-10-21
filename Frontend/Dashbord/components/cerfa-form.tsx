"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FileText, MapPin, User, Building, Upload, X } from "lucide-react"

interface CerfaFormProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function CerfaForm({ onClose, onSubmit }: CerfaFormProps) {
  const [formData, setFormData] = useState({
    // Identité du demandeur
    civilite: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    email: "",

    // Adresse du demandeur
    adresseDemandeur: "",
    codePostalDemandeur: "",
    villeDemandeur: "",

    // Terrain d'assiette
    adresseTerrain: "",
    codePostalTerrain: "",
    villeTerrain: "",
    numerosParcelles: "",
    surfaceTerrain: "",

    // Nature des travaux
    natureProjet: "",
    descriptionTravaux: "",
    surfacePlancher: "",
    surfaceEmpriseAuSol: "",
    hauteurMax: "",

    // Dates
    dateCommencementTravaux: "",
    dateAchevementTravaux: "",

    // Documents joints
    documentsJoints: [] as string[],
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocumentToggle = (document: string) => {
    setFormData((prev) => ({
      ...prev,
      documentsJoints: prev.documentsJoints.includes(document)
        ? prev.documentsJoints.filter((doc) => doc !== document)
        : [...prev.documentsJoints, document],
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const requiredDocuments = [
    "Plan de situation (DP1)",
    "Plan de masse (DP2)",
    "Plan en coupe (DP3)",
    "Notice descriptive (DP4)",
    "Plan des façades et toitures (DP5)",
    "Document graphique (DP6)",
    "Photographie proche (DP7)",
    "Photographie lointaine (DP8)",
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Identité du demandeur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="civilite">Civilité *</Label>
                  <Select value={formData.civilite} onValueChange={(value) => handleInputChange("civilite", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monsieur">Monsieur</SelectItem>
                      <SelectItem value="madame">Madame</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@exemple.fr"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-card-foreground mb-3">Adresse du demandeur</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="adresseDemandeur">Adresse complète *</Label>
                  <Input
                    id="adresseDemandeur"
                    value={formData.adresseDemandeur}
                    onChange={(e) => handleInputChange("adresseDemandeur", e.target.value)}
                    placeholder="Numéro et nom de rue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codePostalDemandeur">Code postal *</Label>
                    <Input
                      id="codePostalDemandeur"
                      value={formData.codePostalDemandeur}
                      onChange={(e) => handleInputChange("codePostalDemandeur", e.target.value)}
                      placeholder="75001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="villeDemandeur">Ville *</Label>
                    <Input
                      id="villeDemandeur"
                      value={formData.villeDemandeur}
                      onChange={(e) => handleInputChange("villeDemandeur", e.target.value)}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Terrain d'assiette du projet
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="adresseTerrain">Adresse du terrain *</Label>
                  <Input
                    id="adresseTerrain"
                    value={formData.adresseTerrain}
                    onChange={(e) => handleInputChange("adresseTerrain", e.target.value)}
                    placeholder="Adresse complète du terrain"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codePostalTerrain">Code postal *</Label>
                    <Input
                      id="codePostalTerrain"
                      value={formData.codePostalTerrain}
                      onChange={(e) => handleInputChange("codePostalTerrain", e.target.value)}
                      placeholder="75001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="villeTerrain">Ville *</Label>
                    <Input
                      id="villeTerrain"
                      value={formData.villeTerrain}
                      onChange={(e) => handleInputChange("villeTerrain", e.target.value)}
                      placeholder="Paris"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numerosParcelles">Numéros de parcelles *</Label>
                    <Input
                      id="numerosParcelles"
                      value={formData.numerosParcelles}
                      onChange={(e) => handleInputChange("numerosParcelles", e.target.value)}
                      placeholder="Ex: 123, 124"
                    />
                  </div>
                  <div>
                    <Label htmlFor="surfaceTerrain">Surface du terrain (m²) *</Label>
                    <Input
                      id="surfaceTerrain"
                      value={formData.surfaceTerrain}
                      onChange={(e) => handleInputChange("surfaceTerrain", e.target.value)}
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Nature des travaux
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="natureProjet">Nature du projet *</Label>
                  <Select
                    value={formData.natureProjet}
                    onValueChange={(value) => handleInputChange("natureProjet", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extension">Extension de maison</SelectItem>
                      <SelectItem value="abri">Abri de jardin</SelectItem>
                      <SelectItem value="piscine">Piscine</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                      <SelectItem value="veranda">Véranda</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="descriptionTravaux">Description détaillée des travaux *</Label>
                  <Textarea
                    id="descriptionTravaux"
                    value={formData.descriptionTravaux}
                    onChange={(e) => handleInputChange("descriptionTravaux", e.target.value)}
                    placeholder="Décrivez précisément les travaux envisagés..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="surfacePlancher">Surface de plancher (m²)</Label>
                    <Input
                      id="surfacePlancher"
                      value={formData.surfacePlancher}
                      onChange={(e) => handleInputChange("surfacePlancher", e.target.value)}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="surfaceEmpriseAuSol">Emprise au sol (m²)</Label>
                    <Input
                      id="surfaceEmpriseAuSol"
                      value={formData.surfaceEmpriseAuSol}
                      onChange={(e) => handleInputChange("surfaceEmpriseAuSol", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hauteurMax">Hauteur maximale (m)</Label>
                    <Input
                      id="hauteurMax"
                      value={formData.hauteurMax}
                      onChange={(e) => handleInputChange("hauteurMax", e.target.value)}
                      placeholder="3.5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateCommencementTravaux">Date de commencement des travaux</Label>
                    <Input
                      id="dateCommencementTravaux"
                      type="date"
                      value={formData.dateCommencementTravaux}
                      onChange={(e) => handleInputChange("dateCommencementTravaux", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateAchevementTravaux">Date d'achèvement prévue</Label>
                    <Input
                      id="dateAchevementTravaux"
                      type="date"
                      value={formData.dateAchevementTravaux}
                      onChange={(e) => handleInputChange("dateAchevementTravaux", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents à joindre
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sélectionnez les documents que vous souhaitez que l'IA génère automatiquement :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requiredDocuments.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={doc}
                      checked={formData.documentsJoints.includes(doc)}
                      onCheckedChange={() => handleDocumentToggle(doc)}
                    />
                    <Label htmlFor={doc} className="text-sm font-normal cursor-pointer">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Documents existants (optionnel)</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Vous pouvez également télécharger vos propres documents si vous en avez déjà.
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger des fichiers
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">Formulaire CERFA - Déclaration Préalable</CardTitle>
            <CardDescription>Remplissez les informations nécessaires pour générer votre dossier DP</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${i + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step titles */}
          <div className="flex justify-between text-xs text-muted-foreground mb-6">
            <span className={currentStep === 1 ? "text-primary font-medium" : ""}>Demandeur</span>
            <span className={currentStep === 2 ? "text-primary font-medium" : ""}>Terrain</span>
            <span className={currentStep === 3 ? "text-primary font-medium" : ""}>Travaux</span>
            <span className={currentStep === 4 ? "text-primary font-medium" : ""}>Documents</span>
          </div>

          {/* Form content */}
          <div className="min-h-[400px] overflow-y-auto">{renderStep()}</div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}>Suivant</Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  Générer le dossier DP
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
