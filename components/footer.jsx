import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer id="contact" className="border-t bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/TAVICA.svg" alt="Tavica Logo" className="h-30 w-30" />
            </div>
          </div>          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Tautan</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="/aboutus" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Verifikasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Kontak</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-gray-600" />
                <span className="text-gray-600">info@tavica.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-gray-600" />
                <span className="text-gray-600">+62812345678</span>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-gray-600" />
                <span className="text-gray-600">Jl. Nina Jadulu No. 123, Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Sosial Media</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Tavica. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
