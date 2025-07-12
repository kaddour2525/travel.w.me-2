import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { FirebaseProvider } from "@/components/firebase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "travel.W.me - Find Your Perfect Travel Companion",
  description: "Connect with like-minded travelers and explore the world together",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>{children}</AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
