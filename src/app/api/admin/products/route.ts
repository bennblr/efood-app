import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const list = await prisma.product.findMany({
    include: { category: true },
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    list.map((p) => ({
      id: p.id,
      categoryId: p.categoryId,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      available: p.available,
      category: p.category
        ? { id: p.category.id, title: p.category.title }
        : null,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const body = await req.json();
  const { categoryId, title, description, price, imageUrl, available } = body;
  if (!categoryId || !title || price == null) {
    return NextResponse.json(
      { error: "categoryId, title, price required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      categoryId,
      title,
      description: description ?? null,
      price: Number(price),
      imageUrl: imageUrl ?? null,
      available: available !== false,
    },
  });
  await createAuditLog(user.userId, "CREATE_PRODUCT", "product", product.id);
  return NextResponse.json({
    id: product.id,
    categoryId: product.categoryId,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    available: product.available,
  });
}
