"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Komponen Input sederhana
function Input({ className = "", ...props }) {
  return (
    <input
      className={`block w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm ${className}`}
      {...props}
    />
  )
}

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    tanggalLahir: "",
    nik: "",
    alamat: "", // legacy, not used anymore
    dusun: "",
    rt: "",
    rw: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    noWa: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.tanggalLahir || !formData.nik || !formData.dusun || !formData.rt || !formData.rw || !formData.desa || !formData.kecamatan || !formData.kabupaten || !formData.provinsi || !formData.noWa) {
      setError("Please fill in all fields")
      return
    }
    // NIK validation
    if (!/^\d{16}$/.test(formData.nik)) {
      setError("NIK harus 16 digit angka")
      return
    }

    // No WA validation
    if (!/^\d{10,15}$/.test(formData.noWa)) {
      setError("No WA harus 10-15 digit angka")
      return
    }

    // Username validation
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          tanggalLahir: formData.tanggalLahir,
          nik: formData.nik,
          dusun: formData.dusun,
          rt: formData.rt,
          rw: formData.rw,
          desa: formData.desa,
          kecamatan: formData.kecamatan,
          kabupaten: formData.kabupaten,
          provinsi: formData.provinsi,
          noWa: formData.noWa,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }
      // Success - redirect to login
      router.push("/auth/login");
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="nik" className="block text-sm font-medium text-gray-700">
            NIK
          </Label>
          <Input
            id="nik"
            name="nik"
            type="text"
            required
            value={formData.nik}
            onChange={handleChange}
            className="mt-1"
            maxLength={16}
            placeholder="16 digit NIK"
          />
        </div>
        <div>
          <Label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700">
            Tanggal Lahir
          </Label>
          <Input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            required
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        {/* Alamat jalan dihapus, gunakan field detail alamat */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dusun" className="block text-sm font-medium text-gray-700">Dusun</Label>
            <Input id="dusun" name="dusun" type="text" required value={formData.dusun} onChange={handleChange} className="mt-1" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="rt" className="block text-sm font-medium text-gray-700">RT</Label>
              <Input id="rt" name="rt" type="text" required value={formData.rt} onChange={handleChange} className="mt-1" />
            </div>
            <div className="flex-1">
              <Label htmlFor="rw" className="block text-sm font-medium text-gray-700">RW</Label>
              <Input id="rw" name="rw" type="text" required value={formData.rw} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="desa" className="block text-sm font-medium text-gray-700">Desa</Label>
            <Input id="desa" name="desa" type="text" required value={formData.desa} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700">Kecamatan</Label>
            <Input id="kecamatan" name="kecamatan" type="text" required value={formData.kecamatan} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700">Kabupaten</Label>
            <Input id="kabupaten" name="kabupaten" type="text" required value={formData.kabupaten} onChange={handleChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="provinsi" className="block text-sm font-medium text-gray-700">Provinsi</Label>
            <Input id="provinsi" name="provinsi" type="text" required value={formData.provinsi} onChange={handleChange} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="noWa" className="block text-sm font-medium text-gray-700">
            No WhatsApp
          </Label>
          <Input
            id="noWa"
            name="noWa"
            type="text"
            required
            value={formData.noWa}
            onChange={handleChange}
            className="mt-1"
            placeholder="08xxxxxxxxxx"
            maxLength={15}
          />
        </div>
        <div>
          <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="mt-1"
            placeholder="johndoe"
          />
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading} className="w-full bg-black hover:bg-gray-700 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
              {/* Divider & Create account */}
      <div className="my-6 flex items-center gap-4 text-sm text-gray-400">
        <div className="flex-1 border-t" />
        <p>Already have an account?</p>
        <div className="flex-1 border-t" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={() => router.push("/auth/login")}
      >
        Sign in instead
      </Button>
      </div>
    </form>
  )
}
