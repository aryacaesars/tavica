import AuthNavbar from "@/components/auth/auth-navbar"

export default function AuthLayout({ children }) {
  return (
    <div>
      <AuthNavbar />
      <main>{children}</main>
    </div>
  )
}
