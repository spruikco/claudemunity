import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Shield } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-primary">
        <Shield className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex space-x-2 border-b">
        <Link
          href="/admin"
          className="px-4 py-2 text-sm font-medium hover:text-primary"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/spaces"
          className="px-4 py-2 text-sm font-medium hover:text-primary"
        >
          Spaces
        </Link>
        <Link
          href="/admin/users"
          className="px-4 py-2 text-sm font-medium hover:text-primary"
        >
          Users
        </Link>
      </div>

      {children}
    </div>
  )
}
