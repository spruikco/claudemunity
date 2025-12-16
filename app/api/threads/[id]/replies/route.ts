import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const replies = await prisma.threadReply.findMany({
      where: {
        threadId: params.id,
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
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(replies)
  } catch (error) {
    console.error("Error fetching replies:", error)
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Create reply and update thread in a transaction
    const [reply] = await prisma.$transaction([
      prisma.threadReply.create({
        data: {
          content: content.trim(),
          threadId: params.id,
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
      }),
      prisma.thread.update({
        where: { id: params.id },
        data: {
          replyCount: { increment: 1 },
          lastActivityAt: new Date(),
        },
      }),
    ])

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error("Error creating reply:", error)
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    )
  }
}
