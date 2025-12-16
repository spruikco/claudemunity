"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  displayName: string
  username: string
  avatarUrl: string | null
  bio: string | null
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users?limit=100")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage community members
        </p>
      </div>

      <Card>
        <div className="divide-y">
          {users.map((user) => {
            const initials = user.displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()

            return (
              <div key={user.id} className="p-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{user.displayName}</p>
                    {user.role === "ADMIN" && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Joined{" "}
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}
    </div>
  )
}
