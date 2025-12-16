import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"

export async function GET() {
  try {
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

    return NextResponse.json(spaces)
  } catch (error) {
    console.error("Error fetching spaces:", error)
    return NextResponse.json(
      { error: "Failed to fetch spaces" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, icon } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const slug = slugify(name, { lower: true, strict: true })

    const space = await prisma.space.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    })

    return NextResponse.json(space, { status: 201 })
  } catch (error) {
    console.error("Error creating space:", error)
    return NextResponse.json(
      { error: "Failed to create space" },
      { status: 500 }
    )
  }
}
