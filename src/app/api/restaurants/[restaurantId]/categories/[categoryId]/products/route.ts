import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ restaurantId: string; categoryId: string }> }
) {
  const { restaurantId, categoryId } = await params;
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      category: { restaurantId },
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
