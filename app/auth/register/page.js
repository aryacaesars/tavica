import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create a new account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a href="/auth/login" className="font-medium text-gray-700 hover:text-gray-900">
              sign in to your existing account
            </a>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
