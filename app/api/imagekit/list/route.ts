import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const folder = searchParams.get("folder") || "user-photos"

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 })
    }

    // Import dynamique d'ImageKit côté serveur
    const ImageKit = (await import("imagekit")).default

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    })

    // Lister les fichiers de l'utilisateur
    const files = await imagekit.listFiles({
      path: `/travel-app/${folder}`,
      tags: `user-${userId}`,
      limit: 50,
    })

    console.log(`✅ ${files.length} fichiers trouvés pour l'utilisateur ${userId}`)

    return NextResponse.json({ files, count: files.length })
  } catch (error: any) {
    console.error("❌ Erreur listage ImageKit:", error)
    return NextResponse.json({ error: error.message || "Erreur lors du listage des fichiers" }, { status: 500 })
  }
}
