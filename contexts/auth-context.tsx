"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getUserProfile, setupAuthListener, type UserProfile } from "@/lib/auth"

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
      } catch (error) {
        console.error("Error refreshing profile:", error)
      }
    }
  }

  const loadUserProfile = async (user: any | null) => {
    setUser(user)
    if (user) {
      try {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
      } catch (error) {
        console.error("Error loading user profile:", error)
        setProfile(null)
      }
    } else {
      setProfile(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initAuthListener = async () => {
      try {
        unsubscribe = await setupAuthListener(loadUserProfile)
      } catch (error) {
        console.error("Error setting up auth listener:", error)
        setLoading(false)
      }
    }

    initAuthListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
