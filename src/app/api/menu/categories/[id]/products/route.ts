import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  const products = await prisma.product.findMany({
    where: { categoryId, available: true },
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
