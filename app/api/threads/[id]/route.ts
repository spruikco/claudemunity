import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const thread = await prisma.thread.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        },
        space: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    return NextResponse.json(thread)
  } catch (error) {
    console.error("Error fetching thread:", error)
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    )
  }
}
