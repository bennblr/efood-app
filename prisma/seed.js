const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_PHONE = "79001234567";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Администратор";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { phone: ADMIN_PHONE },
    create: {
      phone: ADMIN_PHONE,
      passwordHash,
      name: ADMIN_NAME,
      role: "admin",
    },
    update: {
      passwordHash,
      name: ADMIN_NAME,
      role: "admin",
    },
  });
  console.log("Админ создан/обновлён:", user.id);
  console.log("Телефон:", ADMIN_PHONE);
  console.log("Пароль:", ADMIN_PASSWORD);
  console.log("Войдите на /login и откройте /admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
