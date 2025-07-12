import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Import dynamique d'ImageKit côté serveur
    const ImageKit = (await import("imagekit")).default

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    })

    // Générer le token d'authentification
    const authenticationParameters = imagekit.getAuthenticationParameters()

    console.log("✅ Token ImageKit généré:", authenticationParameters)

    return NextResponse.json(authenticationParameters)
  } catch (error) {
    console.error("❌ Erreur génération token ImageKit:", error)
    return NextResponse.json({ error: "Erreur lors de la génération du token d'authentification" }, { status: 500 })
  }
}
