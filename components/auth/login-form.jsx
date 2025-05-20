"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Komponen Input sederhana
function Input({ className = "", ...props }) {
  return (
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm ${className}`}
      {...props}
    />
  )
}


export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // RBAC: tidak perlu toggle admin/user, backend akan handle role

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Hapus session/cookie lama sebelum login baru
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.removeItem('admin_role');

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Satu endpoint login, backend akan handle role
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      // Get the session to check the role
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      if (session?.user?.role === "admin" || session?.user?.role === "superadmin") {
        router.push("/dashboard");
      } else {
        router.push("/user");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-black">Welcome back</h1>
        <p className="text-sm text-gray-500">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
        )}

        {/* Email */}
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email ?? ""}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="mt-1"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password *
            </Label>
            <a href="#" className="text-sm text-gray-700 hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password ?? ""}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>




        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>

      {/* Divider & Create account */}
      <div className="my-6 flex items-center gap-4 text-sm text-gray-400">
        <div className="flex-1 border-t" />
        <p>Don't have an account?</p>
        <div className="flex-1 border-t" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={() => router.push("/auth/register")}
      >
         Create an account
      </Button>
    </div>
  );
}
