"use client"

// Configuration ImageKit côté client
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  authenticationEndpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/imagekit/auth`,
}

// Types pour ImageKit
export interface ImageKitUploadResponse {
  fileId: string
  name: string
  size: number
  versionInfo: {
    id: string
    name: string
  }
  filePath: string
  url: string
  fileType: string
  height?: number
  width?: number
  thumbnailUrl?: string
  AITags?: any[]
}

export interface ImageKitError {
  message: string
  help: string
}

// Fonction pour uploader un fichier vers ImageKit avec gestion d'erreurs améliorée
export const uploadToImageKit = async (
  file: File,
  fileName?: string,
  folder?: string,
  tags?: string[],
  onProgress?: (progress: number) => void,
): Promise<ImageKitUploadResponse> => {
  console.log("🚀 DÉBUT uploadToImageKit")
  console.log("📄 Fichier:", file.name, file.type, file.size)
  console.log("📁 Dossier:", folder)
  console.log("🏷️ Tags:", tags)

  return new Promise((resolve, reject) => {
    // Vérifications préliminaires
    if (!file) {
      console.error("❌ Aucun fichier fourni")
      reject(new Error("Aucun fichier fourni"))
      return
    }

    if (file.size === 0) {
      console.error("❌ Fichier vide")
      reject(new Error("Le fichier est vide"))
      return
    }

    console.log("📦 Import du SDK ImageKit...")

    // Import dynamique d'ImageKit avec gestion d'erreur
    import("imagekit-javascript")
      .then(({ default: ImageKit }) => {
        console.log("✅ SDK ImageKit importé avec succès")

        try {
          // Initialisation d'ImageKit
          console.log("🔧 Configuration ImageKit:", {
            publicKey: imagekitConfig.publicKey ? "✅ Présente" : "❌ Manquante",
            urlEndpoint: imagekitConfig.urlEndpoint,
            authEndpoint: imagekitConfig.authenticationEndpoint,
          })

          const imagekit = new ImageKit(imagekitConfig)
          console.log("✅ Instance ImageKit créée")

          // Paramètres d'upload
          const uploadParams = {
            file: file,
            fileName: fileName || file.name,
            folder: folder || "/travel-app/user-photos",
            tags: tags || ["user-upload", "travel-app"],
            useUniqueFileName: true,
            responseFields: ["tags", "customCoordinates", "isPrivateFile", "metadata", "AITags"],
          }

          console.log("📋 Paramètres d'upload:", uploadParams)

          // Démarrer l'upload
          console.log("🚀 Lancement de l'upload ImageKit...")

          imagekit.upload(
            uploadParams,
            (err: ImageKitError | null, result: ImageKitUploadResponse | undefined) => {
              if (err) {
                console.error("💥 ERREUR CALLBACK ImageKit:", err)
                console.error("- Message:", err.message)
                console.error("- Help:", err.help)
                reject(new Error(`Erreur ImageKit: ${err.message}`))
              } else if (result) {
                console.log("🎉 SUCCESS CALLBACK ImageKit!")
                console.log("📊 Résultat complet:", result)
                console.log("- FileID:", result.fileId)
                console.log("- URL:", result.url)
                console.log("- FilePath:", result.filePath)
                console.log("- Size:", result.size)
                resolve(result)
              } else {
                console.error("❌ Aucun résultat reçu d'ImageKit")
                reject(new Error("Aucun résultat reçu d'ImageKit"))
              }
            },
            {
              onUploadProgress: (progress: any) => {
                if (progress && progress.total > 0) {
                  const percentage = Math.round((progress.loaded / progress.total) * 100)
                  console.log(`📊 Progrès upload ImageKit: ${percentage}% (${progress.loaded}/${progress.total})`)
                  if (onProgress) {
                    onProgress(percentage)
                  }
                } else {
                  console.log("📊 Progrès upload:", progress)
                }
              },
              onUploadStart: () => {
                console.log("🏁 Upload ImageKit démarré")
              },
            },
          )
        } catch (initError) {
          console.error("💥 ERREUR INITIALISATION ImageKit:", initError)
          reject(new Error(`Erreur d'initialisation ImageKit: ${initError}`))
        }
      })
      .catch((importError) => {
        console.error("💥 ERREUR IMPORT ImageKit SDK:", importError)
        reject(new Error("Impossible de charger le SDK ImageKit. Vérifiez votre connexion internet."))
      })
  })
}

// Fonction pour générer une URL transformée
export const getImageKitUrl = (
  filePath: string,
  transformations?: {
    height?: number
    width?: number
    quality?: number
    format?: "jpg" | "png" | "webp" | "avif"
    crop?: "maintain_ratio" | "force" | "at_least" | "at_max"
    focus?: "auto" | "face" | "center"
  },
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!

  if (!transformations) {
    return `${baseUrl}${filePath}`
  }

  const transformParams = []

  if (transformations.height) transformParams.push(`h-${transformations.height}`)
  if (transformations.width) transformParams.push(`w-${transformations.width}`)
  if (transformations.quality) transformParams.push(`q-${transformations.quality}`)
  if (transformations.format) transformParams.push(`f-${transformations.format}`)
  if (transformations.crop) transformParams.push(`c-${transformations.crop}`)
  if (transformations.focus) transformParams.push(`fo-${transformations.focus}`)

  const transformString = transformParams.length > 0 ? `tr:${transformParams.join(",")}` : ""

  return `${baseUrl}/${transformString}${filePath}`
}

// Fonction pour supprimer un fichier
export const deleteFromImageKit = async (fileId: string): Promise<boolean> => {
  try {
    console.log("🗑️ Suppression ImageKit - FileID:", fileId)

    const response = await fetch("/api/imagekit/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId }),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ Fichier supprimé d'ImageKit:", fileId)
      return true
    } else {
      console.error("❌ Erreur suppression ImageKit:", result.error)
      return false
    }
  } catch (error) {
    console.error("❌ Erreur suppression ImageKit:", error)
    return false
  }
}

// Fonction pour lister les fichiers d'un utilisateur
export const listUserFiles = async (userId: string, folder?: string): Promise<any[]> => {
  try {
    const response = await fetch(`/api/imagekit/list?userId=${userId}&folder=${folder || "user-photos"}`)
    const result = await response.json()

    if (response.ok) {
      return result.files || []
    } else {
      console.error("❌ Erreur listage ImageKit:", result.error)
      return []
    }
  } catch (error) {
    console.error("❌ Erreur listage ImageKit:", error)
    return []
  }
}
