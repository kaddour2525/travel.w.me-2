"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plane, Camera, Heart, Users, Shield, Loader2, AlertCircle, Upload } from "lucide-react"
import { signUpWithEmail } from "@/lib/auth"
import { activities } from "@/lib/activities"
import CountrySelect from "@/components/country-select"
import { saveUserProfile } from "@/lib/user-service"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    age: "",
    gender: "",
    maritalStatus: "",
    interestedIn: "",
    height: "",
    education: "",
    country: "",
    city: "",
    languages: [],
    habits: {
      smoker: false,
      drinksAlcohol: false,
      usesCannabis: false,
    },
    aboutYou: "",
    destination: "",
    destinationCity: "",
    tripDuration: "",
    travelPurpose: "",
    mainActivity: "",
  })

  const countries = [
    "United States",
    "United Kingdom",
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Japan",
    "Australia",
    "Canada",
    "Brazil",
    "Mexico",
    "India",
    "China",
    "Other",
  ]

  const languages = [
    // Langues européennes
    "French",
    "English",
    "Spanish",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Dutch",
    "Polish",
    "Romanian",
    "Czech",
    "Hungarian",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Greek",
    "Bulgarian",
    "Croatian",
    "Serbian",
    "Ukrainian",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Slovak",
    "Slovenian",
    "Albanian",
    "Macedonian",
    "Bosnian",
    "Montenegrin",

    // Langues asiatiques
    "Chinese (Mandarin)",
    "Chinese (Cantonese)",
    "Japanese",
    "Korean",
    "Hindi",
    "Bengali",
    "Urdu",
    "Punjabi",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay",
    "Tagalog",
    "Burmese",
    "Khmer",
    "Lao",
    "Mongolian",
    "Tibetan",
    "Nepali",
    "Sinhala",

    // Langues du Moyen-Orient et Afrique du Nord
    "Arabic",
    "Hebrew",
    "Persian (Farsi)",
    "Turkish",
    "Kurdish",
    "Armenian",
    "Georgian",
    "Azerbaijani",

    // Langues africaines
    "Swahili",
    "Amharic",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Zulu",
    "Xhosa",
    "Afrikaans",
    "Somali",
    "Oromo",
    "Tigrinya",
    "Shona",
    "Kinyarwanda",
    "Kirundi",
    "Luganda",
    "Wolof",
    "Bambara",
    "Fulani",
    "Akan",
    "Ewe",

    // Langues des Amériques
    "Portuguese (Brazilian)",
    "Quechua",
    "Guarani",
    "Nahuatl",
    "Maya",
    "Aymara",
    "Mapuche",
    "Inuktitut",
    "Cherokee",
    "Navajo",

    // Langues d'Océanie
    "Maori",
    "Fijian",
    "Samoan",
    "Tongan",
    "Hawaiian",
    "Tahitian",

    // Autres langues importantes
    "Esperanto",
    "Latin",
    "Sanskrit",
    "Sign Language",
    "Other",
  ]

  const travelPurposes = [
    "Romantic meeting",
    "Female-only group",
    "Male-only group",
    "Cost-sharing",
    "Group travel",
    "LGBT+ group",
    "Senior group",
    "Youth group",
    "Other",
  ]

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Créer le compte utilisateur
      const { user } = await signUpWithEmail(formData.email, formData.password, formData.fullName)

      // Sauvegarder toutes les données du formulaire dans Firebase
      await saveUserProfile(user.uid, {
        email: formData.email,
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        interestedIn: formData.interestedIn,
        height: formData.height,
        education: formData.education,
        country: formData.country,
        city: formData.city,
        languages: formData.languages,
        habits: formData.habits,
        aboutYou: formData.aboutYou,
        destination: formData.destination,
        destinationCity: formData.destinationCity,
        tripDuration: formData.tripDuration,
        travelPurpose: formData.travelPurpose,
        mainActivity: formData.mainActivity,
        verified: false,
        isProfilePublic: true,
        allowMessages: true,
        showLastActive: true,
      })

      console.log("✅ Compte créé et données sauvegardées dans Firebase")
      router.push("/profile") // Rediriger vers le profil pour ajouter des photos
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Cette adresse email est déjà utilisée"
      case "auth/invalid-email":
        return "Adresse email invalide"
      case "auth/weak-password":
        return "Le mot de passe est trop faible"
      default:
        return "Erreur lors de la création du compte"
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Créer votre compte</h2>
              <p className="text-gray-600">Commençons par les informations de base</p>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Créez un mot de passe sécurisé"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
              <p className="text-gray-600">Aidez les autres à mieux vous connaître</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Genre</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Femme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Autre</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Statut matrimonial</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Célibataire</SelectItem>
                  <SelectItem value="married">Marié(e)</SelectItem>
                  <SelectItem value="divorced">Divorcé(e)</SelectItem>
                  <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                  <SelectItem value="complicated">C'est compliqué</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Intéressé(e) par</Label>
              <Select
                value={formData.interestedIn}
                onValueChange={(value) => setFormData({ ...formData, interestedIn: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la préférence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Hommes</SelectItem>
                  <SelectItem value="women">Femmes</SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                  <SelectItem value="travel-only">Compagnons de voyage uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Localisation et langues</h2>
              <p className="text-gray-600">D'où venez-vous et quelles langues parlez-vous ?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pays de résidence</Label>
                <CountrySelect
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                  placeholder="Sélectionner le pays"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  placeholder="Votre ville"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Niveau d'éducation</Label>
              <Select
                value={formData.education}
                onValueChange={(value) => setFormData({ ...formData, education: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">Lycée</SelectItem>
                  <SelectItem value="bachelor">Licence</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="phd">Doctorat</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Langues parlées</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {languages.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={formData.languages.includes(lang)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, languages: [...formData.languages, lang] })
                        } else {
                          setFormData({ ...formData, languages: formData.languages.filter((l) => l !== lang) })
                        }
                      }}
                    />
                    <Label htmlFor={lang} className="text-sm">
                      {lang}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Préférences de voyage</h2>
              <p className="text-gray-600">Parlez-nous de vos projets de voyage</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pays de destination</Label>
                <CountrySelect
                  value={formData.destination}
                  onValueChange={(value) => setFormData({ ...formData, destination: value })}
                  placeholder="Où voulez-vous aller ?"
                />
              </div>
              <div>
                <Label htmlFor="destinationCity">Ville de destination</Label>
                <Input
                  id="destinationCity"
                  placeholder="Ville spécifique"
                  value={formData.destinationCity}
                  onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tripDuration">Durée du voyage</Label>
              <Input
                id="tripDuration"
                placeholder="ex: 1 semaine, 10 jours, flexible"
                value={formData.tripDuration}
                onChange={(e) => setFormData({ ...formData, tripDuration: e.target.value })}
              />
            </div>
            <div>
              <Label>Objectif du voyage</Label>
              <Select
                value={formData.travelPurpose}
                onValueChange={(value) => setFormData({ ...formData, travelPurpose: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quel est votre objectif ?" />
                </SelectTrigger>
                <SelectContent>
                  {travelPurposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Activité principale</Label>
              <Select
                value={formData.mainActivity}
                onValueChange={(value) => setFormData({ ...formData, mainActivity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Que voulez-vous faire ?" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem key={activity.name} value={activity.name}>
                      <div className="flex items-center space-x-2">
                        <span>{activity.emoji}</span>
                        <span>{activity.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Touches finales</h2>
              <p className="text-gray-600">Complétez votre profil</p>
            </div>
            <div>
              <Label>Habitudes</Label>
              <div className="space-y-3 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoker"
                    checked={formData.habits.smoker}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        habits: { ...formData.habits, smoker: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="smoker">Fumeur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alcohol"
                    checked={formData.habits.drinksAlcohol}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        habits: { ...formData.habits, drinksAlcohol: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="alcohol">Boit de l'alcool</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cannabis"
                    checked={formData.habits.usesCannabis}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        habits: { ...formData.habits, usesCannabis: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="cannabis">Utilise le cannabis</Label>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="aboutYou">À propos de vous</Label>
              <Textarea
                id="aboutYou"
                placeholder="Parlez aux futurs compagnons de voyage de vous, de votre style de voyage et de ce que vous recherchez..."
                className="min-h-[120px]"
                value={formData.aboutYou}
                onChange={(e) => setFormData({ ...formData, aboutYou: e.target.value })}
              />
            </div>

            {/* Section photos améliorée */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Photos de profil</h3>
                <p className="text-gray-600 mb-4">
                  Vous pourrez ajouter vos photos après avoir créé votre compte pour rendre votre profil plus attractif
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
                  <div className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                    <span>Upload facile</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <Plane className="h-8 w-8" />
            <span className="text-2xl font-bold">travel.W.me</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Étape {step} sur 5</span>
            <span className="text-sm text-gray-600">{((step / 5) * 100).toFixed(0)}% Terminé</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep} disabled={loading}>
                  Précédent
                </Button>
              )}
              <div className="ml-auto">
                {step < 5 ? (
                  <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    Étape suivante
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création du compte...
                      </>
                    ) : (
                      "Terminer l'inscription"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Sécurisé et privé</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Profils vérifiés</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>Conforme RGPD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
