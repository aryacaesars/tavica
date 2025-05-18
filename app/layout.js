import "./globals.css"
import { Providers } from "./providers"

export const metadata = {
  title: "Tavica - Permohonan Dokumen Kelurahan Digital",
  description:
    "Platform administrasi kelurahan digital untuk meningkatkan efisiensi dan transparansi pelayanan publik.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-white text-black font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
