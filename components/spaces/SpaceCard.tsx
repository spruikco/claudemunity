import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Hash, MessageSquare, FileText } from "lucide-react"

interface SpaceCardProps {
  space: {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string | null
    _count?: {
      channels: number
      threads: number
    }
  }
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space.slug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center space-x-3">
            {space.icon ? (
              <span className="text-3xl">{space.icon}</span>
            ) : (
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle>{space.name}</CardTitle>
              {space.description && (
                <CardDescription className="mt-1">
                  {space.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        {space._count && (
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{space._count.channels} channels</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{space._count.threads} threads</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
