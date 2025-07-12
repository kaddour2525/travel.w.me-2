"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, X, Check, AlertCircle, Loader2, ImageIcon, Cloud, FolderOpen } from "lucide-react"
import { uploadToImageKit, getImageKitUrl, deleteFromImageKit, type ImageKitUploadResponse } from "@/lib/imagekit"

interface PhotoUploadProps {
  photos: (string | null)[]
  onPhotosChange: (photos: (string | null)[]) => void
  userId?: string
  maxPhotos?: number
}

interface PhotoData {
  url: string
  fileId?: string
  filePath?: string
}

export default function PhotoUpload({ photos, onPhotosChange, userId = "user123", maxPhotos = 6 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [photoData, setPhotoData] = useState<(PhotoData | null)[]>(
    photos.map((photo) => (photo ? { url: photo } : null)),
  )

  // Références pour les inputs de fichier
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const uploadPhoto = useCallback(
    async (file: File, index: number) => {
      console.log("🚀 DÉBUT UPLOAD - Fichier:", file.name, "Index:", index, "Taille:", file.size)

      setUploading(index)
      setUploadProgress(0)
      setError(null)
      setSuccess(null)

      try {
        // Validation stricte du fichier
        console.log("🔍 Validation du fichier...")
        console.log("- Type MIME:", file.type)
        console.log("- Nom:", file.name)
        console.log("- Taille:", file.size, "bytes")

        // Types de fichiers acceptés
        const validImageTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/bmp",
          "image/tiff",
        ]

        const validVideoTypes = ["video/mp4", "video/mov", "video/avi", "video/quicktime"]

        const validAudioTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/m4a", "audio/aac"]

        const allValidTypes = [...validImageTypes, ...validVideoTypes, ...validAudioTypes]

        if (!allValidTypes.includes(file.type.toLowerCase())) {
          console.error("❌ Type de fichier non supporté:", file.type)
          throw new Error(`Format "${file.type}" non supporté. Utilisez: JPG, PNG, GIF, WebP, MP4, MOV, MP3, WAV`)
        }

        // Vérification de la taille
        const maxSize = file.type.startsWith("image/") ? 15 * 1024 * 1024 : 50 * 1024 * 1024
        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024)
          throw new Error(`Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum ${maxSizeMB}MB`)
        }

        console.log("✅ Fichier validé avec succès")

        // Créer une URL temporaire pour prévisualisation immédiate
        const tempUrl = URL.createObjectURL(file)
        console.log("🖼️ URL temporaire créée:", tempUrl)

        // Mise à jour immédiate de l'interface
        const newPhotos = [...photos]
        newPhotos[index] = tempUrl
        onPhotosChange(newPhotos)

        // Déterminer le dossier de destination
        let folder = "/travel-app/user-photos"
        let mediaType = "photo"

        if (file.type.startsWith("video/")) {
          folder = "/travel-app/user-videos"
          mediaType = "video"
        } else if (file.type.startsWith("audio/")) {
          folder = "/travel-app/user-audio"
          mediaType = "audio"
        }

        console.log("📁 Dossier de destination:", folder)
        console.log("🏷️ Type de média:", mediaType)

        // Nom de fichier unique
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const fileName = `${userId}_${index}_${timestamp}_${randomId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

        console.log("📝 Nom de fichier généré:", fileName)

        // Tags pour l'organisation
        const tags = [`user-${userId}`, "travel-app", mediaType, `slot-${index}`, `upload-${timestamp}`]

        console.log("🏷️ Tags:", tags)

        // Upload vers ImageKit avec gestion du progrès
        console.log("☁️ Début upload vers ImageKit...")

        const result: ImageKitUploadResponse = await uploadToImageKit(file, fileName, folder, tags, (progress) => {
          console.log(`📊 Progrès upload: ${progress}%`)
          setUploadProgress(progress)
        })

        console.log("🎉 Upload ImageKit terminé avec succès!")
        console.log("📄 Résultat:", {
          fileId: result.fileId,
          url: result.url,
          filePath: result.filePath,
          size: result.size,
        })

        // Libérer l'URL temporaire
        URL.revokeObjectURL(tempUrl)
        console.log("🧹 URL temporaire libérée")

        // Générer l'URL optimisée pour les images
        let finalUrl = result.url
        if (file.type.startsWith("image/")) {
          finalUrl = getImageKitUrl(result.filePath, {
            width: 800,
            height: 800,
            quality: 85,
            format: "webp",
            crop: "maintain_ratio",
            focus: "auto",
          })
          console.log("🖼️ URL optimisée générée:", finalUrl)
        }

        // Mettre à jour les données avec les informations ImageKit
        const newPhotosData = [...photoData]
        newPhotosData[index] = {
          url: finalUrl,
          fileId: result.fileId,
          filePath: result.filePath,
        }
        setPhotoData(newPhotosData)

        // Mettre à jour les photos avec l'URL finale
        const finalPhotos = [...photos]
        finalPhotos[index] = finalUrl
        onPhotosChange(finalPhotos)

        // Message de succès
        const mediaTypeText = file.type.startsWith("video/")
          ? "Vidéo"
          : file.type.startsWith("audio/")
            ? "Audio"
            : "Photo"
        setSuccess(`✅ ${mediaTypeText} ${index + 1} ajoutée avec succès sur ImageKit!`)

        console.log("🎊 Upload complètement terminé!")

        // Effacer le message de succès après 4 secondes
        setTimeout(() => {
          setSuccess(null)
        }, 4000)
      } catch (err) {
        console.error("💥 ERREUR UPLOAD:", err)

        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de l'upload"
        setError(`❌ ${errorMessage}`)

        // Nettoyer en cas d'erreur
        const newPhotos = [...photos]
        if (newPhotos[index] && newPhotos[index]?.startsWith("blob:")) {
          URL.revokeObjectURL(newPhotos[index]!)
          console.log("🧹 URL temporaire nettoyée après erreur")
        }
        newPhotos[index] = null
        onPhotosChange(newPhotos)

        const newPhotosData = [...photoData]
        newPhotosData[index] = null
        setPhotoData(newPhotosData)

        // Effacer l'erreur après 6 secondes
        setTimeout(() => {
          setError(null)
        }, 6000)
      } finally {
        setUploading(null)
        setUploadProgress(0)
        console.log("🏁 Processus d'upload terminé")
      }
    },
    [photos, onPhotosChange, userId, photoData],
  )

  const handleFileSelect = useCallback(
    (index: number) => {
      console.log("📂 OUVERTURE SÉLECTEUR - Index:", index)

      try {
        // Créer un nouvel input file
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*,video/*,audio/*"
        input.multiple = false
        input.style.display = "none"
        input.style.position = "absolute"
        input.style.left = "-9999px"

        // Stocker la référence
        fileInputRefs.current[index] = input

        console.log("📁 Input créé:", {
          type: input.type,
          accept: input.accept,
          multiple: input.multiple,
        })

        // Ajouter au DOM
        document.body.appendChild(input)

        // Gestionnaire de changement
        const handleChange = async (e: Event) => {
          console.log("📥 CHANGEMENT DÉTECTÉ dans l'input")

          const target = e.target as HTMLInputElement
          const files = target.files

          console.log("📋 Fichiers détectés:", files?.length || 0)

          if (files && files.length > 0) {
            const file = files[0]
            console.log("📄 FICHIER SÉLECTIONNÉ:", {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: new Date(file.lastModified).toISOString(),
            })

            // Vérification supplémentaire
            if (file.size === 0) {
              console.error("❌ Fichier vide détecté")
              setError("Le fichier sélectionné est vide")
              return
            }

            if (!file.type) {
              console.error("❌ Type MIME manquant")
              setError("Impossible de déterminer le type de fichier")
              return
            }

            console.log("🚀 Lancement de l'upload...")
            await uploadPhoto(file, index)
          } else {
            console.log("⚠️ Aucun fichier sélectionné")
          }

          // Nettoyer
          console.log("🧹 Nettoyage de l'input")
          if (document.body.contains(input)) {
            document.body.removeChild(input)
          }
          fileInputRefs.current[index] = null
        }

        // Gestionnaire d'erreur
        const handleError = (e: Event) => {
          console.error("💥 ERREUR INPUT FILE:", e)
          setError("Erreur lors de la sélection du fichier")

          if (document.body.contains(input)) {
            document.body.removeChild(input)
          }
          fileInputRefs.current[index] = null
        }

        // Attacher les événements
        input.addEventListener("change", handleChange, { once: true })
        input.addEventListener("error", handleError, { once: true })

        // Déclencher le sélecteur
        console.log("🖱️ Ouverture du sélecteur de fichier...")
        input.click()
      } catch (error) {
        console.error("💥 ERREUR CRÉATION INPUT:", error)
        setError("Erreur lors de l'ouverture du sélecteur de fichier")
      }
    },
    [uploadPhoto],
  )

  const removePhoto = useCallback(
    async (index: number) => {
      console.log("🗑️ SUPPRESSION - Index:", index)

      const currentPhotoData = photoData[index]
      console.log("📄 Données actuelles:", currentPhotoData)

      // Supprimer de ImageKit si on a un fileId
      if (currentPhotoData?.fileId) {
        try {
          console.log("☁️ Suppression d'ImageKit - FileID:", currentPhotoData.fileId)
          const deleted = await deleteFromImageKit(currentPhotoData.fileId)
          if (deleted) {
            console.log("✅ Fichier supprimé d'ImageKit avec succès")
          } else {
            console.warn("⚠️ Échec de la suppression d'ImageKit")
          }
        } catch (error) {
          console.error("❌ Erreur suppression ImageKit:", error)
        }
      }

      const newPhotos = [...photos]

      // Libérer l'URL si c'est une URL temporaire
      if (newPhotos[index] && newPhotos[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(newPhotos[index]!)
        console.log("🧹 URL temporaire libérée")
      }

      newPhotos[index] = null
      onPhotosChange(newPhotos)

      const newPhotosData = [...photoData]
      newPhotosData[index] = null
      setPhotoData(newPhotosData)

      setError(null)
      setSuccess(null)

      console.log("✅ Suppression terminée")
    },
    [photos, onPhotosChange, photoData],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, index: number) => {
      e.preventDefault()
      e.stopPropagation()

      console.log("📥 DRAG & DROP - Index:", index)

      const files = Array.from(e.dataTransfer.files)
      console.log("📋 Fichiers déposés:", files.length)

      const mediaFile = files.find(
        (file) => file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/"),
      )

      if (mediaFile) {
        console.log("🎬 Média détecté:", mediaFile.name, mediaFile.type)
        await uploadPhoto(mediaFile, index)
      } else {
        console.log("❌ Aucun média valide trouvé")
        setError("Veuillez déposer un fichier image, vidéo ou audio valide")
        setTimeout(() => setError(null), 3000)
      }
    },
    [uploadPhoto],
  )

  const getFileTypeIcon = (photo: string | null, index: number) => {
    if (!photo) return <ImageIcon className="h-8 w-8 text-gray-400" />

    const photoInfo = photoData[index]
    if (photoInfo?.filePath) {
      if (photoInfo.filePath.includes("/user-videos/")) {
        return <span className="text-2xl">🎬</span>
      }
      if (photoInfo.filePath.includes("/user-audio/")) {
        return <span className="text-2xl">🎵</span>
      }
    }

    return <ImageIcon className="h-8 w-8 text-gray-400" />
  }

  const renderMediaPreview = (photo: string | null, index: number) => {
    if (!photo) return null

    const photoInfo = photoData[index]

    if (photoInfo?.filePath?.includes("/user-videos/")) {
      return (
        <video
          src={photo}
          className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
          controls
          muted
          onError={() => {
            console.error("❌ Erreur chargement vidéo:", photo)
            removePhoto(index)
          }}
          onLoadStart={() => console.log("📹 Début chargement vidéo")}
          onLoadedData={() => console.log("✅ Vidéo chargée")}
        />
      )
    }

    if (photoInfo?.filePath?.includes("/user-audio/")) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-gray-200 shadow-sm">
          <span className="text-4xl mb-2">🎵</span>
          <audio
            src={photo}
            controls
            className="w-full max-w-[200px]"
            onError={() => {
              console.error("❌ Erreur chargement audio:", photo)
              removePhoto(index)
            }}
            onLoadStart={() => console.log("🎵 Début chargement audio")}
            onLoadedData={() => console.log("✅ Audio chargé")}
          />
        </div>
      )
    }

    return (
      <img
        src={photo || "/placeholder.svg"}
        alt={`Média ${index + 1}`}
        className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-sm"
        onError={() => {
          console.error("❌ Erreur chargement image:", photo)
          removePhoto(index)
        }}
        onLoad={() => console.log("✅ Image chargée:", photo)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Messages d'état améliorés */}
      {error && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-300 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">{success}</AlertDescription>
        </Alert>
      )}

      {/* Instructions d'utilisation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <FolderOpen className="h-4 w-4 mr-2" />
          Comment ajouter vos fichiers :
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            • <strong>Cliquez sur "Parcourir"</strong> pour sélectionner depuis votre disque dur
          </p>
          <p>
            • <strong>Glissez-déposez</strong> directement vos fichiers sur les zones
          </p>
          <p>
            • <strong>Formats supportés :</strong> Images (JPG, PNG, WebP), Vidéos (MP4, MOV), Audio (MP3, WAV)
          </p>
        </div>
      </div>

      {/* Grille de médias */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: maxPhotos }).map((_, index) => {
          const photo = photos[index]
          const isUploading = uploading === index

          return (
            <div key={index} className="relative aspect-square">
              {photo ? (
                <div className="relative w-full h-full group">
                  {renderMediaPreview(photo, index)}

                  {/* Badge photo principale */}
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">Média principal</Badge>
                  )}

                  {/* Badge ImageKit */}
                  <Badge className="absolute bottom-2 left-2 bg-green-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <Cloud className="h-3 w-3 mr-1" />
                    ImageKit
                  </Badge>

                  {/* Bouton supprimer */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Overlay pour changer le média */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleFileSelect(index)}
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      Changer
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isUploading
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onClick={() => !isUploading && handleFileSelect(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => !isUploading && handleDrop(e, index)}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      <span className="text-sm text-blue-600 font-medium">Upload vers ImageKit...</span>
                      <div className="w-24">
                        <Progress value={uploadProgress} className="h-3" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">{Math.round(uploadProgress)}%</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 p-4">
                      <div className="p-3 bg-gray-100 rounded-full">{getFileTypeIcon(null, index)}</div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {index === 0 ? "Média principal" : `Média ${index + 1}`}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Cliquez ou glissez un fichier</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white hover:bg-blue-50 border-blue-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileSelect(index)
                        }}
                      >
                        <FolderOpen className="h-3 w-3 mr-1" />
                        Parcourir
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Informations techniques */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <h4 className="font-medium text-green-900 mb-3 flex items-center">
          <Cloud className="h-4 w-4 mr-2" />
          Stockage ImageKit - Spécifications techniques :
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-green-800">
          <div>
            <p className="font-medium mb-1">📸 Images :</p>
            <ul className="space-y-1 text-xs">
              <li>• JPG, PNG, WebP, GIF</li>
              <li>• Maximum 15MB</li>
              <li>• Optimisation automatique</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">🎬 Vidéos :</p>
            <ul className="space-y-1 text-xs">
              <li>• MP4, MOV, AVI</li>
              <li>• Maximum 50MB</li>
              <li>• Streaming optimisé</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">🎵 Audio :</p>
            <ul className="space-y-1 text-xs">
              <li>• MP3, WAV, M4A</li>
              <li>• Maximum 50MB</li>
              <li>• Qualité préservée</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistiques et statut */}
      <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">
            <strong>{photos.filter((p) => p !== null).length}</strong> / {maxPhotos} médias uploadés
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-xs font-medium">ImageKit connecté</span>
          </div>
        </div>

        {photos.filter((p) => p !== null).length >= 3 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <Check className="h-3 w-3 mr-1" />
            Profil multimédia complet
          </Badge>
        )}
      </div>

      {/* Debug info en développement */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded font-mono">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>• Photos chargées: {photos.filter((p) => p !== null).length}</p>
          <p>• Upload en cours: {uploading !== null ? `Index ${uploading}` : "Aucun"}</p>
          <p>• Progrès: {uploadProgress}%</p>
          <p>• UserID: {userId}</p>
        </div>
      )}
    </div>
  )
}
