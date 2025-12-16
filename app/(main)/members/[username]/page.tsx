import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarUrl: true,
      bio: true,
      role: true,
      createdAt: true,
      threads: {
        include: {
          space: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      replies: {
        include: {
          thread: {
            include: {
              space: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  })

  if (!user) {
    notFound()
  }

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                {user.role === "ADMIN" && (
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              {user.bio && <p className="mt-4">{user.bio}</p>}
              <p className="text-sm text-muted-foreground">
                Member since{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Threads ({user.threads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {user.threads.length > 0 ? (
              <div className="space-y-3">
                {user.threads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/spaces/${thread.space.slug}/t/${thread.id}`}
                    className="block p-3 rounded border hover:bg-accent transition-colors"
                  >
                    <h3 className="font-semibold text-sm">{thread.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      in {thread.space.name} •{" "}
                      {formatDistanceToNow(new Date(thread.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No threads yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Replies ({user.replies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {user.replies.length > 0 ? (
              <div className="space-y-3">
                {user.replies.map((reply) => (
                  <Link
                    key={reply.id}
                    href={`/spaces/${reply.thread.space.slug}/t/${reply.thread.id}`}
                    className="block p-3 rounded border hover:bg-accent transition-colors"
                  >
                    <p className="text-sm line-clamp-2">{reply.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      on {reply.thread.title} •{" "}
                      {formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No replies yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
