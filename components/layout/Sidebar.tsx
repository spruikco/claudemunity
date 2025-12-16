"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Settings, Shield, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface Space {
  id: string
  name: string
  slug: string
  icon: string | null
}

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [spaces, setSpaces] = useState<Space[]>([])

  useEffect(() => {
    fetch("/api/spaces")
      .then((res) => res.json())
      .then((data) => setSpaces(data))
      .catch((err) => console.error("Failed to fetch spaces:", err))
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/members", icon: Users, label: "Members" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  if (userRole === "ADMIN") {
    navItems.push({ href: "/admin", icon: Shield, label: "Admin" })
  }

  return (
    <aside className="w-64 border-r bg-background h-screen overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">C</span>
          </div>
          <span className="font-bold text-lg">Community</span>
        </Link>
      </div>

      <nav className="px-4 py-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-6">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Spaces
            </h3>
          </div>
          <div className="space-y-1">
            {spaces.map((space) => (
              <Link
                key={space.id}
                href={`/spaces/${space.slug}`}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname.startsWith(`/spaces/${space.slug}`)
                    ? "bg-accent"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {space.icon ? (
                  <span className="text-lg">{space.icon}</span>
                ) : (
                  <Hash className="w-5 h-5" />
                )}
                <span>{space.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}
