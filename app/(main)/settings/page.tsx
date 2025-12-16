import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your profile information is managed through your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Display Name</label>
              <p className="text-sm text-muted-foreground mt-1">
                {session.user.name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Username</label>
              <p className="text-sm text-muted-foreground mt-1">
                @{session.user.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground mt-1">
                {session.user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-sm text-muted-foreground mt-1">
                {session.user.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Additional settings and preferences will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings functionality coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
