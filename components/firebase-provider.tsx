"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { initializeFirebaseServices, isFirebaseReady } from "@/lib/firebase"

interface FirebaseProviderProps {
  children: React.ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [initializationState, setInitializationState] = useState<"loading" | "ready" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        console.log("FirebaseProvider: Starting initialization...")

        // Attendre un petit délai pour s'assurer que le DOM est prêt
        await new Promise((resolve) => setTimeout(resolve, 100))

        const success = await initializeFirebaseServices()

        if (success && isFirebaseReady()) {
          console.log("FirebaseProvider: Initialization successful")
          setInitializationState("ready")
        } else {
          console.warn("FirebaseProvider: Initialization failed, continuing in degraded mode")
          setErrorMessage("Firebase services unavailable")
          setInitializationState("ready") // Continue anyway
        }
      } catch (error) {
        console.error("FirebaseProvider: Initialization error:", error)
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
        setInitializationState("ready") // Continue in degraded mode
      }
    }

    initFirebase()
  }, [])

  if (initializationState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation de l'application...</p>
          <p className="text-sm text-gray-500 mt-2">Configuration des services...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {errorMessage && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Mode dégradé: {errorMessage}. Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}
