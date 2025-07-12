"use client"

import { getDb, initializeFirebaseServices } from "./firebase"
import type { UserProfile } from "./auth"

// Interface pour les données complètes du profil utilisateur
export interface CompleteUserProfile extends UserProfile {
  // Informations personnelles étendues
  profilePhotos?: string[]
  phoneNumber?: string
  dateOfBirth?: Date
  occupation?: string
  company?: string

  // Préférences de voyage étendues
  travelBudget?: string
  travelStyle?: string
  accommodationPreference?: string
  transportPreference?: string

  // Préférences de matching
  ageRangeMin?: number
  ageRangeMax?: number
  maxDistance?: number
  preferredGenders?: string[]

  // Statistiques et métadonnées
  profileCompleteness?: number
  lastActive?: Date
  joinDate?: Date
  totalTrips?: number
  totalMatches?: number
  responseRate?: number

  // Paramètres de confidentialité
  isProfilePublic?: boolean
  showLastActive?: boolean
  allowMessages?: boolean

  // Localisation
  currentLocation?: {
    latitude: number
    longitude: number
    city: string
    country: string
  }
}

// Helper pour s'assurer que Firebase est initialisé
const ensureFirebaseReady = async () => {
  const isReady = await initializeFirebaseServices()
  if (!isReady) {
    throw new Error("Firebase services are not available")
  }
}

// Sauvegarder le profil utilisateur complet
export const saveUserProfile = async (userId: string, profileData: Partial<CompleteUserProfile>) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")

    // Préparer les données avec timestamps
    const dataToSave = {
      ...profileData,
      uid: userId,
      updatedAt: serverTimestamp(),
      profileCompleteness: calculateProfileCompleteness(profileData),
    }

    // Si c'est un nouveau profil, ajouter la date de création
    if (!profileData.createdAt) {
      dataToSave.createdAt = serverTimestamp()
      dataToSave.joinDate = serverTimestamp()
    }

    // Sauvegarder dans la collection 'users'
    await setDoc(doc(db, "users", userId), dataToSave, { merge: true })

    console.log("✅ Profil utilisateur sauvegardé avec succès dans Firebase")
    return true
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde du profil:", error)
    throw error
  }
}

// Sauvegarder les photos de profil
export const saveUserPhotos = async (userId: string, photos: string[]) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    await updateDoc(doc(db, "users", userId), {
      profilePhotos: photos,
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Photos de profil sauvegardées avec succès")
    return true
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des photos:", error)
    throw error
  }
}

// Récupérer le profil utilisateur complet
export const getUserCompleteProfile = async (userId: string): Promise<CompleteUserProfile | null> => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { doc, getDoc } = await import("firebase/firestore")

    const userDoc = await getDoc(doc(db, "users", userId))

    if (userDoc.exists()) {
      const data = userDoc.data()
      console.log("✅ Profil utilisateur récupéré avec succès")
      return data as CompleteUserProfile
    }

    console.log("⚠️ Aucun profil trouvé pour cet utilisateur")
    return null
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du profil:", error)
    throw error
  }
}

// Sauvegarder les préférences de voyage
export const saveTravelPreferences = async (
  userId: string,
  preferences: {
    destination?: string
    destinationCity?: string
    tripDuration?: string
    travelPurpose?: string
    mainActivity?: string
    travelBudget?: string
    travelStyle?: string
    accommodationPreference?: string
    transportPreference?: string
  },
) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    await updateDoc(doc(db, "users", userId), {
      ...preferences,
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Préférences de voyage sauvegardées avec succès")
    return true
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des préférences:", error)
    throw error
  }
}

// Calculer le pourcentage de complétude du profil
const calculateProfileCompleteness = (profile: Partial<CompleteUserProfile>): number => {
  const requiredFields = [
    "fullName",
    "age",
    "gender",
    "country",
    "city",
    "aboutYou",
    "destination",
    "mainActivity",
    "travelPurpose",
  ]

  const optionalFields = ["profilePhotos", "languages", "education", "height", "maritalStatus"]

  let completedRequired = 0
  let completedOptional = 0

  // Vérifier les champs requis (70% du score)
  requiredFields.forEach((field) => {
    if (profile[field as keyof CompleteUserProfile] && profile[field as keyof CompleteUserProfile] !== "") {
      completedRequired++
    }
  })

  // Vérifier les champs optionnels (30% du score)
  optionalFields.forEach((field) => {
    const value = profile[field as keyof CompleteUserProfile]
    if (value && (Array.isArray(value) ? value.length > 0 : value !== "")) {
      completedOptional++
    }
  })

  const requiredScore = (completedRequired / requiredFields.length) * 70
  const optionalScore = (completedOptional / optionalFields.length) * 30

  return Math.round(requiredScore + optionalScore)
}

// Mettre à jour la dernière activité
export const updateLastActive = async (userId: string) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) return

    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

    await updateDoc(doc(db, "users", userId), {
      lastActive: serverTimestamp(),
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la dernière activité:", error)
  }
}

// Rechercher des utilisateurs par critères
export const searchUsers = async (criteria: {
  destination?: string
  activity?: string
  ageMin?: number
  ageMax?: number
  gender?: string
  country?: string
  limit?: number
}) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { collection, query, where, limit, getDocs } = await import("firebase/firestore")

    let q = query(collection(db, "users"))

    // Appliquer les filtres
    if (criteria.destination) {
      q = query(q, where("destination", "==", criteria.destination))
    }

    if (criteria.activity) {
      q = query(q, where("mainActivity", "==", criteria.activity))
    }

    if (criteria.gender) {
      q = query(q, where("gender", "==", criteria.gender))
    }

    if (criteria.country) {
      q = query(q, where("country", "==", criteria.country))
    }

    // Limiter les résultats
    if (criteria.limit) {
      q = query(q, limit(criteria.limit))
    }

    const querySnapshot = await getDocs(q)
    const users: CompleteUserProfile[] = []

    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), uid: doc.id } as CompleteUserProfile)
    })

    console.log(`✅ ${users.length} utilisateurs trouvés`)
    return users
  } catch (error) {
    console.error("❌ Erreur lors de la recherche d'utilisateurs:", error)
    throw error
  }
}

// Sauvegarder un message
export const saveMessage = async (
  conversationId: string,
  message: {
    senderId: string
    receiverId: string
    content: string
    type: "text" | "image" | "location"
  },
) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const messageData = {
      ...message,
      timestamp: serverTimestamp(),
      read: false,
    }

    await addDoc(collection(db, "conversations", conversationId, "messages"), messageData)

    console.log("✅ Message sauvegardé avec succès")
    return true
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde du message:", error)
    throw error
  }
}

// Créer une nouvelle conversation
export const createConversation = async (user1Id: string, user2Id: string) => {
  try {
    await ensureFirebaseReady()

    const db = getDb()
    if (!db) {
      throw new Error("Firebase Firestore not available")
    }

    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

    const conversationData = {
      participants: [user1Id, user2Id],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "conversations"), conversationData)

    console.log("✅ Conversation créée avec succès")
    return docRef.id
  } catch (error) {
    console.error("❌ Erreur lors de la création de la conversation:", error)
    throw error
  }
}
