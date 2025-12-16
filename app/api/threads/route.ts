import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const spaceId = searchParams.get("spaceId")

    const where = spaceId ? { spaceId } : {}

    const threads = await prisma.thread.findMany({
      where,
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
      orderBy: {
        lastActivityAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Error fetching threads:", error)
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, spaceId } = await req.json()

    if (!title || !content || !spaceId) {
      return NextResponse.json(
        { error: "Title, content, and spaceId are required" },
        { status: 400 }
      )
    }

    const thread = await prisma.thread.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        spaceId,
        userId: session.user.id,
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
      },
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    console.error("Error creating thread:", error)
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    )
  }
}
