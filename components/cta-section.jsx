import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-16 sm:p-16">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Siap Untuk Memulai?</h2>
            <p className="mt-4 text-lg text-gray-300">
              Bergabunglah dengan kami dan tingkatkan pengalaman Anda dalam mengelola data dan informasi.              
            </p>
            <div className="mt-10 flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <Link
                href="/auth/login"
                className="rounded-md bg-white px-8 py-3 text-center text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-3 text-center text-base font-medium text-white shadow-sm hover:from-gray-600 hover:to-gray-500"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
