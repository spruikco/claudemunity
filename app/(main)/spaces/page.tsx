import { prisma } from "@/lib/prisma"
import { SpaceCard } from "@/components/spaces/SpaceCard"

export default async function SpacesPage() {
  const spaces = await prisma.space.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      _count: {
        select: {
          channels: true,
          threads: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Spaces</h1>
        <p className="text-muted-foreground mt-2">
          Browse all community spaces and join the conversation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>

      {spaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No spaces yet. Check back later!
          </p>
        </div>
      )}
    </div>
  )
}
