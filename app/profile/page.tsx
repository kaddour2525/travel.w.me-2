"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plane,
  Camera,
  Edit,
  Save,
  MapPin,
  Verified,
  Settings,
  User,
  Globe,
  Check,
  Calendar,
  MessageCircle,
  Users,
  Star,
} from "lucide-react"
import PhotoUpload from "@/components/photo-upload"
import CountrySelect from "@/components/country-select"
import { activities } from "@/lib/activities"
import { saveUserProfile, saveUserPhotos, saveTravelPreferences } from "@/lib/user-service"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profilePhotos, setProfilePhotos] = useState([
    "/placeholder.svg?height=300&width=300",
    null,
    null,
    null,
    null,
    null,
  ])
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    age: "28",
    gender: "male",
    maritalStatus: "single",
    interestedIn: "women",
    height: "175",
    education: "bachelor",
    country: "France",
    city: "Paris",
    languages: ["French", "English", "Spanish"],
    habits: {
      smoker: false,
      drinksAlcohol: true,
      usesCannabis: false,
    },
    aboutYou:
      "Passionate traveler who loves discovering new cultures and meeting interesting people. I enjoy hiking, trying local cuisines, and exploring historical sites. Looking for travel companions who share similar interests!",
    destination: "Japan",
    destinationCity: "Tokyo",
    tripDuration: "2 weeks",
    travelPurpose: "Cultural trip",
    mainActivity: "Cultural Trip",
    verified: false,
  })

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
    "Cultural trip",
    "Adventure trip",
    "Business travel",
    "Solo travel",
    "Family travel",
    "Senior group",
    "Youth group",
    "Other",
  ]

  // Fonction pour sauvegarder le profil
  const handleSaveProfile = async () => {
    try {
      if (!user) {
        alert("Vous devez être connecté pour sauvegarder votre profil")
        return
      }

      console.log("🔄 Sauvegarde du profil en cours...")

      // Sauvegarder les données du profil
      await saveUserProfile(user.uid, profileData)

      // Sauvegarder les photos séparément
      if (profilePhotos.some((photo) => photo !== null)) {
        await saveUserPhotos(user.uid, profilePhotos.filter((photo) => photo !== null) as string[])
      }

      // Sauvegarder les préférences de voyage
      await saveTravelPreferences(user.uid, {
        destination: profileData.destination,
        destinationCity: profileData.destinationCity,
        tripDuration: profileData.tripDuration,
        travelPurpose: profileData.travelPurpose,
        mainActivity: profileData.mainActivity,
      })

      setIsEditing(false)
      alert("✅ Profil sauvegardé avec succès dans Firebase!")

      console.log("✅ Toutes les données ont été sauvegardées dans Firebase")
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error)
      alert("❌ Erreur lors de la sauvegarde du profil. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">travel.W.me</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Retour au Dashboard</Button>
              </Link>
              <Avatar>
                <AvatarImage src={profilePhotos[0] || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>
                  {profileData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={profilePhotos[0] || "/placeholder.svg?height=96&width=96"}
                        alt="Photo de profil"
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {profileData.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Indicateur de statut en ligne */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profileData.fullName}, {profileData.age}
                      </h1>
                      {profileData.verified && (
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          <Verified className="h-4 w-4 mr-1" />
                          Profil Vérifié
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        En ligne
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">
                          🇫🇷 {profileData.city}, {profileData.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Destination: 🇯🇵 {profileData.destination}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <span>Dernière connexion: il y a 5 min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <span>•</span>
                        <span>Taux de réponse: 95%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    className={`${
                      isEditing
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } px-6 py-2 font-medium`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Sauvegarder les modifications
                      </>
                    ) : (
                      <>
                        <Edit className="h-5 w-5 mr-2" />
                        Modifier mon profil
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="personal">Informations</TabsTrigger>
              <TabsTrigger value="travel">Voyage</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-6 w-6 text-blue-600" />
                    <span>Mes Photos de Profil</span>
                  </CardTitle>
                  <CardDescription>
                    Ajoutez jusqu'à 6 photos pour rendre votre profil plus attractif.
                    <strong> La première photo sera votre photo principale</strong> visible sur votre profil.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Aperçu de la photo principale */}
                  {profilePhotos[0] && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Camera className="h-5 w-5 mr-2" />
                        Photo principale actuelle :
                      </h4>
                      <div className="flex items-center space-x-4">
                        <img
                          src={profilePhotos[0] || "/placeholder.svg"}
                          alt="Photo principale"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <div className="text-sm text-blue-800">
                          <p>✅ Cette photo apparaît sur votre profil</p>
                          <p>✅ Visible dans les résultats de recherche</p>
                          <p>✅ Affichée dans les conversations</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <PhotoUpload
                    photos={profilePhotos}
                    onPhotosChange={setProfilePhotos}
                    userId="user123"
                    maxPhotos={6}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Info Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-6 w-6 text-blue-600" />
                    <span>Mes Informations Personnelles</span>
                  </CardTitle>
                  {!isEditing && (
                    <CardDescription className="flex items-center space-x-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Profil sauvegardé - Cliquez sur "Modifier" pour apporter des changements</span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informations de base avec indicateurs visuels */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Label htmlFor="fullName" className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>Nom complet</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50 border-gray-200" : "border-blue-300 focus:border-blue-500"}
                      />
                      {!isEditing && profileData.fullName && (
                        <Check className="absolute right-3 top-8 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="relative">
                      <Label htmlFor="age" className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Âge</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50 border-gray-200" : "border-blue-300 focus:border-blue-500"}
                      />
                      {!isEditing && profileData.age && (
                        <Check className="absolute right-3 top-8 h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Langues parlées avec badges visuels */}
                  <div>
                    <Label className="flex items-center space-x-2 mb-3">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span>Langues parlées</span>
                      {!isEditing && profileData.languages.length > 0 && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          {profileData.languages.length} langue(s)
                        </Badge>
                      )}
                    </Label>

                    {!isEditing && profileData.languages.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profileData.languages.map((lang) => (
                          <Badge key={lang} className="bg-blue-100 text-blue-800 border-blue-200">
                            🗣️ {lang}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {isEditing && (
                      <div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                        {languages.map((lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox
                              id={lang}
                              checked={profileData.languages.includes(lang)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setProfileData({
                                    ...profileData,
                                    languages: [...profileData.languages, lang],
                                  })
                                } else {
                                  setProfileData({
                                    ...profileData,
                                    languages: profileData.languages.filter((l) => l !== lang),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={lang} className="text-sm cursor-pointer">
                              {lang}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* À propos de moi avec compteur de caractères */}
                  <div>
                    <Label htmlFor="aboutYou" className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <span>À propos de moi</span>
                      {!isEditing && profileData.aboutYou && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          ✅ Complété
                        </Badge>
                      )}
                    </Label>
                    <Textarea
                      id="aboutYou"
                      placeholder="Parlez-nous de vous, de vos passions de voyage..."
                      className={`min-h-[120px] mt-2 ${!isEditing ? "bg-gray-50 border-gray-200" : "border-blue-300 focus:border-blue-500"}`}
                      value={profileData.aboutYou}
                      onChange={(e) => setProfileData({ ...profileData, aboutYou: e.target.value })}
                      disabled={!isEditing}
                    />
                    {isEditing && (
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {profileData.aboutYou.length}/500 caractères
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Travel Tab */}
            <TabsContent value="travel">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-blue-600" />
                    <span>Mes Préférences de Voyage</span>
                  </CardTitle>
                  {!isEditing && (
                    <CardDescription className="flex items-center space-x-2 text-green-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Destination: {profileData.destination} • Activité: {profileData.mainActivity}
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Résumé du voyage planifié */}
                  {!isEditing && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                        <Plane className="h-5 w-5 mr-2" />
                        Mon Voyage Planifié :
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Destination:</span>
                            <span>🇯🇵 {profileData.destination}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Ville:</span>
                            <span>{profileData.destinationCity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">Durée:</span>
                            <span>{profileData.tripDuration}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="font-medium">Objectif:</span>
                            <span>{profileData.travelPurpose}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">Activité:</span>
                            <Badge
                              className={`${activities.find((a) => a.name === profileData.mainActivity)?.color || "bg-gray-100 text-gray-800"}`}
                            >
                              <span className="mr-1">
                                {activities.find((a) => a.name === profileData.mainActivity)?.emoji}
                              </span>
                              {profileData.mainActivity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Destination souhaitée</Label>
                      <CountrySelect
                        value={profileData.destination}
                        onValueChange={(value) => setProfileData({ ...profileData, destination: value })}
                        disabled={!isEditing}
                        placeholder="Où voulez-vous aller ?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="destinationCity">Ville de destination</Label>
                      <Input
                        id="destinationCity"
                        value={profileData.destinationCity}
                        onChange={(e) => setProfileData({ ...profileData, destinationCity: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tripDuration">Durée du voyage</Label>
                      <Input
                        id="tripDuration"
                        placeholder="ex: 2 semaines, 10 jours"
                        value={profileData.tripDuration}
                        onChange={(e) => setProfileData({ ...profileData, tripDuration: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Activité principale</Label>
                      <Select
                        value={profileData.mainActivity}
                        onValueChange={(value) => setProfileData({ ...profileData, mainActivity: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
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

                  <div>
                    <Label>Objectif du voyage</Label>
                    <Select
                      value={profileData.travelPurpose}
                      onValueChange={(value) => setProfileData({ ...profileData, travelPurpose: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  {/* Selected Activities Display */}
                  <div>
                    <Label>Activité sélectionnée</Label>
                    <div className="mt-2">
                      {profileData.mainActivity && (
                        <Badge
                          className={`${activities.find((a) => a.name === profileData.mainActivity)?.color || "bg-gray-100 text-gray-800"} text-base px-4 py-2`}
                        >
                          <span className="mr-2">
                            {activities.find((a) => a.name === profileData.mainActivity)?.emoji}
                          </span>
                          {profileData.mainActivity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Paramètres du compte</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Vérification du profil</h4>
                        <p className="text-sm text-gray-600">Vérifiez votre identité avec une selfie</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Vérifier maintenant
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications push</h4>
                        <p className="text-sm text-gray-600">Recevoir des notifications pour les messages</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profil visible</h4>
                        <p className="text-sm text-gray-600">Votre profil apparaît dans les recherches</p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Zone de danger</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                    >
                      Supprimer mon compte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
