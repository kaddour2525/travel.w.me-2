import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: "ID de fichier requis" }, { status: 400 })
    }

    // Import dynamique d'ImageKit côté serveur
    const ImageKit = (await import("imagekit")).default

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    })

    // Supprimer le fichier
    await imagekit.deleteFile(fileId)

    console.log("✅ Fichier supprimé d'ImageKit:", fileId)

    return NextResponse.json({ success: true, message: "Fichier supprimé avec succès" })
  } catch (error: any) {
    console.error("❌ Erreur suppression ImageKit:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de la suppression du fichier" }, { status: 500 })
  }
}
