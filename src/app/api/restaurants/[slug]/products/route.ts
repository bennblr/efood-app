import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function findRestaurant(param: string) {
  return prisma.restaurant.findFirst({
    where: { OR: [{ slug: param }, { id: param }] },
  });
}

/** Все товары ресторана: по категориям (по названию категории), затем по названию товара */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: param } = await params;
  const restaurant = await findRestaurant(param);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const products = await prisma.product.findMany({
    where: { category: { restaurantId: restaurant.id } },
    include: { category: { select: { id: true, title: true } } },
    orderBy: [
      { category: { title: "asc" } },
      { title: "asc" },
    ],
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
      category: p.category ? { id: p.category.id, title: p.category.title } : null,
    }))
  );
}
