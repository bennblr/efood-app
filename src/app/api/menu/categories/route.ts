import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    categories.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
    }))
  );
}
