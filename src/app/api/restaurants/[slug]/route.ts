import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Параметр может быть slug (italiano) или id (cuid) — ищем по обоим */
async function findRestaurant(param: string) {
  return prisma.restaurant.findFirst({
    where: {
      OR: [{ slug: param }, { id: param }],
    },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: param } = await params;
  const restaurant = await findRestaurant(param);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    imageUrl: restaurant.imageUrl,
    minOrderAmount: restaurant.minOrderAmount != null ? Number(restaurant.minOrderAmount) : null,
    createdAt: restaurant.createdAt.toISOString(),
  });
}
