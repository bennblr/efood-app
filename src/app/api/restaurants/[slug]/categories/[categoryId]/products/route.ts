import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function findRestaurant(param: string) {
  return prisma.restaurant.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; categoryId: string }> }
) {
  const { slug: param, categoryId } = await params;
  const restaurant = await findRestaurant(param);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      category: { restaurantId: restaurant.id },
    },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      categoryId: p.categoryId,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      available: p.available,
    }))
  );
}
