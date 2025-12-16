import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Hash, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SpacePageProps {
  params: {
    slug: string
  }
}

export default async function SpacePage({ params }: SpacePageProps) {
  const space = await prisma.space.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      threads: {
        include: {
          user: true,
        },
        orderBy: {
          lastActivityAt: "desc",
        },
        take: 20,
      },
    },
  })

  if (!space) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          {space.icon ? (
            <span className="text-4xl">{space.icon}</span>
          ) : (
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Hash className="w-8 h-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{space.name}</h1>
            {space.description && (
              <p className="text-muted-foreground mt-1">{space.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Channels</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6">
              {space.channels.length > 0 ? (
                <div className="space-y-2">
                  {space.channels.map((channel) => (
                    <Link
                      key={channel.id}
                      href={`/spaces/${space.slug}/c/${channel.slug}`}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-accent transition-colors"
                    >
                      <Hash className="w-4 h-4" />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No channels yet</p>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Threads</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6">
              {space.threads.length > 0 ? (
                <div className="space-y-3">
                  {space.threads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/spaces/${space.slug}/t/${thread.id}`}
                      className="block p-3 rounded border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{thread.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            by {thread.user.displayName} •{" "}
                            {formatDistanceToNow(new Date(thread.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.replyCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No threads yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
