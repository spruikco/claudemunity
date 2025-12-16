import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session?.user.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening in your community today.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">
            Activity feed will show recent threads and messages across all spaces.
          </p>
        </div>
      </div>
    </div>
  )
}
