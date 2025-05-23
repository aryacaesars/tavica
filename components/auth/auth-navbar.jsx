import Link from "next/link"

export default function AuthNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-start px-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <img src="/TAVICA.svg" alt="Tavica Logo" className="h-30 w-30" />
        </Link>
      </div>
    </nav>
  );
}