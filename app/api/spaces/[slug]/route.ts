import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const space = await prisma.space.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        channels: true,
      },
    })

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 })
    }

    return NextResponse.json(space)
  } catch (error) {
    console.error("Error fetching space:", error)
    return NextResponse.json(
      { error: "Failed to fetch space" },
      { status: 500 }
    )
  }
}
