import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUserRole,
  unauthorized,
  forbidden,
  requireAdmin,
} from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserRole(req);
  if (!user) return unauthorized();
  if (!requireAdmin(user.role)) return forbidden();

  const list = await prisma.reservation.findMany({
    include: { user: { select: { id: true, name: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(
    list.map((r) => ({
      id: r.id,
      userId: r.userId,
      status: r.status,
      startTime: r.startTime.toISOString(),
      endTime: r.endTime.toISOString(),
      personsCount: r.personsCount,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
    }))
  );
}
