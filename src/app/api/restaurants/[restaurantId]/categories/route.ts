import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params;
  const categories = await prisma.category.findMany({
    where: { restaurantId },
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
