import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const photoIndex = formData.get("photoIndex") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validation du fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please select a valid image file" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB max
      return NextResponse.json({ error: "File size must not exceed 10MB" }, { status: 400 })
    }

    // Pour l'instant, on utilise une simulation d'upload
    // En production, vous pourrez utiliser Firebase Storage
    try {
      // Simulation d'un délai d'upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Créer une URL temporaire pour la démo
      const fileUrl = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(file.name)}`

      // Réponse de succès
      const response = {
        success: true,
        url: fileUrl,
        fileId: `file_${userId}_${photoIndex}_${Date.now()}`,
        name: file.name,
        message: "Photo uploaded successfully!",
      }

      return NextResponse.json(response, { status: 200 })
    } catch (uploadError) {
      console.error("Upload process error:", uploadError)
      return NextResponse.json(
        {
          success: false,
          error: "Upload process failed",
          details: uploadError instanceof Error ? uploadError.message : "Unknown upload error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Upload error:", error)

    // Retourner une réponse JSON valide même en cas d'erreur
    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Route pour obtenir les paramètres d'authentification (optionnel)
export async function GET() {
  try {
    return NextResponse.json({ message: "Upload service ready" }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Service unavailable",
      },
      { status: 500 },
    )
  }
}
