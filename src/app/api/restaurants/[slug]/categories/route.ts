import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function findRestaurant(param: string) {
  return prisma.restaurant.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
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
  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    categories.map((c) => ({
      id: c.id,
      restaurantId: c.restaurantId,
      title: c.title,
      description: c.description,
    }))
  );
}
