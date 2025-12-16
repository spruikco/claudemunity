import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, Hash, MessageSquare, FileText } from "lucide-react"

export default async function AdminDashboard() {
  const [userCount, spaceCount, channelCount, threadCount, messageCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.space.count(),
      prisma.channel.count(),
      prisma.thread.count(),
      prisma.channelMessage.count(),
    ])

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      description: "Registered members",
    },
    {
      title: "Total Spaces",
      value: spaceCount,
      icon: Hash,
      description: "Community spaces",
    },
    {
      title: "Total Channels",
      value: channelCount,
      icon: MessageSquare,
      description: "Chat channels",
    },
    {
      title: "Total Threads",
      value: threadCount,
      icon: FileText,
      description: "Discussion threads",
    },
    {
      title: "Total Messages",
      value: messageCount,
      icon: MessageSquare,
      description: "Channel messages",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Platform statistics and metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the navigation above to manage spaces, channels, and users.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
