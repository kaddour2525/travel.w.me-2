"use client"

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Variables globales pour les services Firebase
let firebaseInitialized = false
let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let firebaseStorage: any = null

// Fonction d'initialisation simplifiée
export const initializeFirebaseServices = async () => {
  // Vérifier si on est côté client
  if (typeof window === "undefined") {
    console.log("Firebase: Server-side detected, skipping initialization")
    return false
  }

  // Éviter la double initialisation
  if (firebaseInitialized) {
    return true
  }

  try {
    console.log("Firebase: Starting initialization...")

    // Import dynamique des modules Firebase
    const { initializeApp, getApps } = await import("firebase/app")

    // Initialiser l'app Firebase
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
      console.log("Firebase: App initialized")
    } else {
      firebaseApp = getApps()[0]
      console.log("Firebase: Using existing app")
    }

    // Initialiser Auth
    try {
      const { getAuth } = await import("firebase/auth")
      firebaseAuth = getAuth(firebaseApp)
      console.log("Firebase: Auth initialized")
    } catch (authError) {
      console.warn("Firebase: Auth initialization failed:", authError)
    }

    // Initialiser Firestore
    try {
      const { getFirestore } = await import("firebase/firestore")
      firebaseDb = getFirestore(firebaseApp)
      console.log("Firebase: Firestore initialized")
    } catch (dbError) {
      console.warn("Firebase: Firestore initialization failed:", dbError)
    }

    // Initialiser Storage
    try {
      const { getStorage } = await import("firebase/storage")
      firebaseStorage = getStorage(firebaseApp)
      console.log("Firebase: Storage initialized")
    } catch (storageError) {
      console.warn("Firebase: Storage initialization failed:", storageError)
    }

    firebaseInitialized = true
    console.log("Firebase: All services initialized successfully")
    return true
  } catch (error) {
    console.error("Firebase: Initialization failed:", error)
    return false
  }
}

// Getters pour les services Firebase
export const getAuth = () => {
  if (!firebaseInitialized || !firebaseAuth) {
    console.warn("Firebase Auth not initialized")
    return null
  }
  return firebaseAuth
}

export const getDb = () => {
  if (!firebaseInitialized || !firebaseDb) {
    console.warn("Firebase Firestore not initialized")
    return null
  }
  return firebaseDb
}

export const getStorage = () => {
  if (!firebaseInitialized || !firebaseStorage) {
    console.warn("Firebase Storage not initialized")
    return null
  }
  return firebaseStorage
}

export const isFirebaseReady = () => firebaseInitialized

// Export par défaut
export default firebaseApp
