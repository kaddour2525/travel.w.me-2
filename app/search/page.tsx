"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import {
  Plane,
  Search,
  MapPin,
  Calendar,
  Users,
  Heart,
  MessageCircle,
  Verified,
  Globe,
  Star,
  SlidersHorizontal,
} from "lucide-react"
import { countries } from "@/lib/countries"
import { activities } from "@/lib/activities"

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [ageRange, setAgeRange] = useState([18, 65])
  const [filters, setFilters] = useState({
    destination: "",
    activity: "",
    gender: "",
    languages: [],
    travelPurpose: "",
    dateRange: "",
  })

  const searchResults = [
    {
      id: 1,
      name: "Maria Santos",
      age: 29,
      location: "Madrid, Spain",
      locationFlag: "🇪🇸",
      destination: "Thailand",
      destinationFlag: "🇹🇭",
      destinationCity: "Bangkok",
      activity: "Adventure",
      travelPurpose: "Group travel",
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      languages: ["Spanish", "English", "Thai"],
      travelDates: "June 15-30, 2024",
      about: "Love exploring new cultures and trying local food. Looking for adventurous travel companions!",
      matchPercentage: 95,
    },
    {
      id: 2,
      name: "James Wilson",
      age: 34,
      location: "London, UK",
      locationFlag: "🇬🇧",
      destination: "Japan",
      destinationFlag: "🇯🇵",
      destinationCity: "Tokyo",
      activity: "Cultural trip",
      travelPurpose: "Cost-sharing",
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      languages: ["English", "Japanese"],
      travelDates: "July 10-25, 2024",
      about: "Photography enthusiast and culture lover. Excited to explore Japan's temples and traditions.",
      matchPercentage: 88,
    },
    {
      id: 3,
      name: "Lisa Chen",
      age: 26,
      location: "Toronto, Canada",
      locationFlag: "🇨🇦",
      destination: "Italy",
      destinationFlag: "🇮🇹",
      destinationCity: "Rome",
      activity: "Food tourism",
      travelPurpose: "Female-only group",
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
      languages: ["English", "French", "Italian"],
      travelDates: "August 5-20, 2024",
      about: "Foodie looking to explore Italian cuisine with like-minded female travelers.",
      matchPercentage: 82,
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      age: 31,
      location: "Dubai, UAE",
      locationFlag: "🇦🇪",
      destination: "Morocco",
      destinationFlag: "🇲🇦",
      destinationCity: "Marrakech",
      activity: "Cultural trip",
      travelPurpose: "Group travel",
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      languages: ["Arabic", "English", "French"],
      travelDates: "September 1-15, 2024",
      about: "Passionate about history and architecture. Looking forward to exploring Morocco's rich heritage.",
      matchPercentage: 79,
    },
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
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Filtres de recherche</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Search */}
                <div>
                  <Label htmlFor="quick-search">Recherche rapide</Label>
                  <Input id="quick-search" placeholder="Nom, destination, activité..." className="mt-1" />
                </div>

                {/* Destination */}
                <div>
                  <Label>Destination</Label>
                  <Select
                    value={filters.destination}
                    onValueChange={(value) => setFilters({ ...filters, destination: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Toute destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.slice(0, 20).map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Range */}
                <div>
                  <Label>
                    Tranche d'âge: {ageRange[0]} - {ageRange[1]} ans
                  </Label>
                  <Slider value={ageRange} onValueChange={setAgeRange} max={65} min={18} step={1} className="mt-2" />
                </div>

                {/* Gender */}
                <div>
                  <Label>Genre</Label>
                  <Select value={filters.gender} onValueChange={(value) => setFilters({ ...filters, gender: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tout genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Activity */}
                <div>
                  <Label>Activité principale</Label>
                  <Select
                    value={filters.activity}
                    onValueChange={(value) => setFilters({ ...filters, activity: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Toute activité" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.slice(0, 15).map((activity) => (
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

                {/* Travel Purpose */}
                <div>
                  <Label>Objectif du voyage</Label>
                  <Select
                    value={filters.travelPurpose}
                    onValueChange={(value) => setFilters({ ...filters, travelPurpose: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Tout objectif" />
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

                {/* Languages */}
                <div>
                  <Label>Langues</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {languages.slice(0, 6).map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang}
                          checked={filters.languages.includes(lang)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, languages: [...filters.languages, lang] })
                            } else {
                              setFilters({ ...filters, languages: filters.languages.filter((l) => l !== lang) })
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

                {/* Verified Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" />
                  <Label htmlFor="verified" className="text-sm">
                    Profils vérifiés uniquement
                  </Label>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Compagnons de voyage</h1>
                <p className="text-gray-600">{searchResults.length} voyageurs trouvés</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="match">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Meilleure correspondance</SelectItem>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="age">Âge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {searchResults.map((person) => (
                <Card key={person.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative">
                      <img
                        src={person.image || "/placeholder.svg"}
                        alt={person.name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      {person.verified && (
                        <Badge className="absolute top-3 left-3 bg-blue-600">
                          <Verified className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        {person.matchPercentage}% Compatible
                      </div>
                    </div>

                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {person.name}, {person.age}
                          </h3>
                          <div className="flex items-center space-x-1 text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span className="flex items-center space-x-1">
                              <span>{person.locationFlag}</span>
                              <span>{person.location}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span>
                              <strong>Destination:</strong>
                              <span className="flex items-center space-x-1 ml-1">
                                <span>{person.destinationFlag}</span>
                                <span>{person.destination}</span>
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              <strong>Dates:</strong> {person.travelDates}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>
                              <strong>Objectif:</strong> {person.travelPurpose}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Star className="h-4 w-4 text-gray-500" />
                            <span>
                              <strong>Activité:</strong> {person.activity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{person.about}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">{person.activity}</Badge>
                        <Badge variant="outline">{person.travelPurpose}</Badge>
                        {person.languages.slice(0, 3).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Dernière activité: il y a 2h</span>
                          <span>•</span>
                          <span>Taux de réponse: 95%</span>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">Voir le profil</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Charger plus de résultats
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
