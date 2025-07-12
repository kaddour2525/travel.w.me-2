"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plane,
  Search,
  Heart,
  MessageCircle,
  Users,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Filter,
  Verified,
  Globe,
  User,
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("discover")

  // Mock data for demonstration
  const matches = [
    {
      id: 1,
      name: "Emma Rodriguez",
      age: 28,
      location: "Barcelona, Spain",
      destination: "Tokyo, Japan",
      activity: "Cultural trip",
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      languages: ["Spanish", "English", "French"],
      travelDates: "March 15-25, 2024",
    },
    {
      id: 2,
      name: "Alex Chen",
      age: 32,
      location: "San Francisco, USA",
      destination: "Bali, Indonesia",
      activity: "Wellness",
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
      languages: ["English", "Chinese"],
      travelDates: "April 1-14, 2024",
    },
    {
      id: 3,
      name: "Sophie Martin",
      age: 26,
      location: "Paris, France",
      destination: "Morocco",
      activity: "Adventure",
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
      languages: ["French", "English", "Arabic"],
      travelDates: "May 10-20, 2024",
    },
  ]

  const messages = [
    {
      id: 1,
      name: "Emma Rodriguez",
      lastMessage: "That sounds like an amazing itinerary! When are you planning to visit the temples?",
      time: "2h ago",
      unread: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Alex Chen",
      lastMessage: "I found this great yoga retreat in Ubud. Want to check it out together?",
      time: "5h ago",
      unread: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const trips = [
    {
      id: 1,
      destination: "Tokyo, Japan",
      dates: "March 15-25, 2024",
      participants: 3,
      status: "Planning",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      destination: "Bali, Indonesia",
      dates: "April 1-14, 2024",
      participants: 2,
      status: "Confirmed",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">travel.W.me</span>
            </Link>

            {/* Header - utiliser la vraie photo de profil */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                </Button>
              </Link>
              <Link href="/profile">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Photo de profil" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discover" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Trips</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Matches</span>
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover">
            <div className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Find Travel Companions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input placeholder="Search by destination, activity, or name..." className="flex-1" />
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Travel Matches */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={match.image || "/placeholder.svg"}
                        alt={match.name}
                        className="w-full h-48 object-cover"
                      />
                      {match.verified && (
                        <Badge className="absolute top-2 right-2 bg-blue-600">
                          <Verified className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {match.name}, {match.age}
                        </h3>
                        <div className="flex space-x-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>Going to {match.destination}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{match.travelDates}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge variant="secondary" className="mr-2">
                          {match.activity}
                        </Badge>
                        {match.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="mr-1 text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Avatar>
                        <AvatarImage src={message.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {message.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{message.name}</h4>
                          <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                      </div>
                      {message.unread && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Trips</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Plan New Trip
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <Card key={trip.id} className="overflow-hidden">
                    <img
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.destination}
                      className="w-full h-32 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{trip.destination}</h3>
                        <Badge variant={trip.status === "Confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{trip.dates}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{trip.participants} participants</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-3 bg-transparent">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Your Matches</span>
                </CardTitle>
                <CardDescription>People who are interested in similar travel experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matches.slice(0, 2).map((match) => (
                    <div key={match.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={match.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {match.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{match.name}</h4>
                        <p className="text-sm text-gray-600">{match.destination}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
