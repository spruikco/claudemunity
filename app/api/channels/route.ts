import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, spaceId } = await req.json()

    if (!name || !spaceId) {
      return NextResponse.json(
        { error: "Name and spaceId are required" },
        { status: 400 }
      )
    }

    const slug = slugify(name, { lower: true, strict: true })

    const channel = await prisma.channel.create({
      data: {
        name,
        slug,
        description,
        spaceId,
      },
    })

    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error("Error creating channel:", error)
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    )
  }
}
