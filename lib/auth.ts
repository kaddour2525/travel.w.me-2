"use client"

import { getAuth, getDb, initializeFirebaseServices } from "./firebase"

// Types pour les données utilisateur
export interface UserProfile {
  uid: string
  email: string
  fullName: string
  age?: string
  gender?: string
  maritalStatus?: string
  interestedIn?: string
  height?: string
  education?: string
  country?: string
  city?: string
  languages?: string[]
  habits?: {
    smoker: boolean
    drinksAlcohol: boolean
    usesCannabis: boolean
  }
  aboutYou?: string
  destination?: string
  destinationCity?: string
  tripDuration?: string
  travelPurpose?: string
  mainActivity?: string
  photos?: string[]
  verified?: boolean
  createdAt: Date
  updatedAt: Date
}

// Helper pour s'assurer que Firebase est initialisé
const ensureFirebaseReady = async () => {
  const isReady = await initializeFirebaseServices()
  if (!isReady) {
    throw new Error("Firebase services are not available")
  }
}

// Inscription avec email/password
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    await ensureFirebaseReady()

    const auth = getAuth()
    const db = getDb()

    if (!auth || !db) {
      throw new Error("Firebase services not available")
    }

    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Mettre à jour le profil avec le nom
    await updateProfile(user, {
      displayName: fullName,
    })

    // Créer le document utilisateur dans Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      fullName,
      photos: [],
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return { user, profile: userProfile }
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

// Connexion avec email/password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    await ensureFirebaseReady()

    const auth = getAuth()

    if (!auth) {
      throw new Error("Firebase auth not available")
    }

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

// Connexion avec Google
export const signInWithGoogle = async () => {
  try {
    await ensureFirebaseReady()

    const auth = getAuth()
    const db = getDb()

    if (!auth || !db) {
      throw new Error("Firebase services not available")
    }

    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
    const { doc, setDoc, getDoc } = await import("firebase/firestore")

    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Vérifier si l'utilisateur existe déjà dans Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      // Créer le profil utilisateur s'il n'existe pas
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        fullName: user.displayName || "",
        photos: [],
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await setDoc(doc(db, "users", user.uid), userProfile)
    }

    return user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

// Connexion avec Facebook
export const signInWithFacebook = async () => {
  try {
    await ensureFirebaseReady()

    const auth = getAuth()
    const db = getDb()

    if (!auth || !db) {
      throw new Error("Firebase services not available")
    }

    const { FacebookAuthProvider, signInWithPopup } = await import("firebase/auth")
    const { doc, setDoc, getDoc } = await import("firebase/firestore")

    const provider = new FacebookAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Vérifier si l'utilisateur existe déjà dans Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      // Créer le profil utilisateur s'il n'existe pas
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        fullName: user.displayName || "",
        photos: [],
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await setDoc(doc(db, "users", user.uid), userProfile)
    }

    return user
  } catch (error) {
    console.error("Error signing in with Facebook:", error)
    throw error
  }
}

// Déconnexion
export const logOut = async () => {
  try {
    await ensureFirebaseReady()

    const auth = getAuth()

    if (!auth) {
      throw new Error("Firebase auth not available")
    }

    const { signOut } = await import("firebase/auth")
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Récupérer le profil utilisateur
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    await ensureFirebaseReady()

    const db = getDb()

    if (!db) {
      throw new Error("Firebase db not available")
    }

    const { doc, getDoc } = await import("firebase/firestore")
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()

    if (!db) {
      throw new Error("Firebase db not available")
    }

    const { doc, updateDoc } = await import("firebase/firestore")
    const updateData = {
      ...profileData,
      updatedAt: new Date(),
    }
    await updateDoc(doc(db, "users", uid), updateData)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Hook pour écouter les changements d'authentification
export const setupAuthListener = async (callback: (user: any) => void) => {
  if (typeof window === "undefined") {
    return () => {}
  }

  try {
    await ensureFirebaseReady()

    const auth = getAuth()

    if (!auth) {
      callback(null)
      return () => {}
    }

    const { onAuthStateChanged } = await import("firebase/auth")
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.error("Error setting up auth state listener:", error)
    callback(null)
    return () => {}
  }
}
