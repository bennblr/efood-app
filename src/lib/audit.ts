import { prisma } from "./prisma";

export async function createAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  restaurantId?: string | null
) {
  await prisma.auditLog.create({
    data: { userId, action, entityType, entityId, restaurantId: restaurantId ?? undefined },
  });
}
