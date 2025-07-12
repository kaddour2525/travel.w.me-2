"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Heart, Users, MapPin, Shield, Globe } from "lucide-react"
import { activities } from "@/lib/activities"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">travel.W.me</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-blue-600"> Travel </span>
              <span className="text-red-500">Companion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with like-minded travelers, create unforgettable memories, and explore the world together. Your
              next adventure is just a match away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Start Matching
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg bg-transparent"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose travel.W.me?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
                <p className="text-gray-600">
                  Advanced algorithms match you with compatible travelers based on destinations, interests, and travel
                  preferences.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
                <p className="text-gray-600">
                  Selfie verification and email confirmation ensure authentic connections with real travelers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Trip Planning</h3>
                <p className="text-gray-600">
                  Organize group trips, share itineraries, and coordinate travel plans seamlessly with your matches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Travel Categories - Section complète avec toutes les activités */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-red-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Find Your Travel Style</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez toutes les activités disponibles et trouvez des compagnons de voyage qui partagent vos passions
          </p>

          {/* Grille complète des activités */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {activities.map((activity) => (
              <Card
                key={activity.name}
                className="hover:shadow-md transition-shadow cursor-pointer group hover:scale-105 transform transition-transform duration-200"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {activity.emoji}
                  </div>
                  <span
                    className={`px-3 py-2 rounded-full text-xs font-medium block ${activity.color} transition-colors duration-200`}
                  >
                    {activity.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques des activités */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
                <div className="text-sm text-gray-600">Activités disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">50+</div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1000+</div>
                <div className="text-sm text-gray-600">Voyageurs actifs</div>
              </div>
            </div>

            <Link href="/register">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-3"
              >
                <Heart className="h-4 w-4 mr-2" />
                Commencer à explorer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-red-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who have found their perfect travel companions
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Create Your Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6" />
                <span className="text-xl font-bold">travel.W.me</span>
              </div>
              <p className="text-gray-400">Connecting travelers worldwide for unforgettable adventures.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Smart Matching</li>
                <li>Trip Planning</li>
                <li>Group Creation</li>
                <li>Secure Messaging</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Safety Tips</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 travel.W.me. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
