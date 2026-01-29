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

  const list = await prisma.category.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json(
    list.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const body = await req.json();
  const { title, description } = body;
  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { title, description: description ?? null },
  });
  await createAuditLog(user.userId, "CREATE_CATEGORY", "category", category.id);
  return NextResponse.json({
    id: category.id,
    title: category.title,
    description: category.description,
  });
}
