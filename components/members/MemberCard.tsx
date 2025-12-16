import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface MemberCardProps {
  user: {
    id: string
    displayName: string
    username: string
    avatarUrl: string | null
    bio: string | null
    role: string
    createdAt: string
  }
}

export function MemberCard({ user }: MemberCardProps) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Link href={`/members/${user.username}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{user.displayName}</h3>
                {user.role === "ADMIN" && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {user.bio}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
