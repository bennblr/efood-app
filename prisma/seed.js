const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "test123";
const SALT_ROUNDS = 10;

const IMG = {
  restaurant1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  restaurant2: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  restaurant3: "https://images.unsplash.com/photo-1424847651672-bf20ade79f6e?w=800",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  salad: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
  cake: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
  juice: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
  steak: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
};

async function hash(p) {
  return bcrypt.hash(p, SALT_ROUNDS);
}

async function ensureCategory(restaurantId, title, description) {
  let c = await prisma.category.findFirst({ where: { restaurantId, title } });
  if (!c) c = await prisma.category.create({ data: { restaurantId, title, description: description || null } });
  return c;
}

async function ensureProduct(categoryId, data) {
  const existing = await prisma.product.findFirst({
    where: { categoryId, title: data.title },
  });
  if (existing) return existing;
  return prisma.product.create({
    data: {
      categoryId,
      title: data.title,
      description: data.description ?? null,
      price: data.price,
      imageUrl: data.imageUrl ?? null,
      available: data.available !== false,
    },
  });
}

async function main() {
  const passwordHash = await hash(DEFAULT_PASSWORD);

  // --- Пользователи ---
  const superAdmin = await prisma.user.upsert({
    where: { phone: "79000000001" },
    create: {
      phone: "79000000001",
      passwordHash,
      name: "Суперадмин",
      role: "admin",
      restaurantId: null,
    },
    update: { passwordHash, name: "Суперадмин", role: "admin", restaurantId: null },
  });

  const r1 = await prisma.restaurant.upsert({
    where: { slug: "italiano" },
    create: {
      name: "Italiano",
      slug: "italiano",
      description: "Итальянская кухня: паста, пицца, тирамису. Уютная атмосфера в центре города.",
      imageUrl: IMG.restaurant1,
    },
    update: { description: "Итальянская кухня: паста, пицца, тирамису.", imageUrl: IMG.restaurant1 },
  });

  const r2 = await prisma.restaurant.upsert({
    where: { slug: "burger-house" },
    create: {
      name: "Burger House",
      slug: "burger-house",
      description: "Бургеры, стейки и картофель фри. Американа и крафтовое пиво.",
      imageUrl: IMG.restaurant2,
    },
    update: { description: "Бургеры, стейки и картофель фри.", imageUrl: IMG.restaurant2 },
  });

  const r3 = await prisma.restaurant.upsert({
    where: { slug: "sakura" },
    create: {
      name: "Сакура",
      slug: "sakura",
      description: "Японская кухня: суши, роллы, лапша. Доставка и зал.",
      imageUrl: IMG.restaurant3,
    },
    update: { description: "Японская кухня: суши, роллы, лапша.", imageUrl: IMG.restaurant3 },
  });

  await prisma.user.upsert({
    where: { phone: "79000000011" },
    create: { phone: "79000000011", passwordHash, name: "Мария Итальянцева", role: "admin", restaurantId: r1.id },
    update: { passwordHash, name: "Мария Итальянцева", role: "admin", restaurantId: r1.id },
  });

  await prisma.user.upsert({
    where: { phone: "79000000012" },
    create: { phone: "79000000012", passwordHash, name: "Иван Бургеров", role: "admin", restaurantId: r2.id },
    update: { passwordHash, name: "Иван Бургеров", role: "admin", restaurantId: r2.id },
  });

  await prisma.user.upsert({
    where: { phone: "79000000021" },
    create: { phone: "79000000021", passwordHash, name: "Анна Официант", role: "employee", restaurantId: r1.id },
    update: { passwordHash, name: "Анна Официант", role: "employee", restaurantId: r1.id },
  });

  const client1 = await prisma.user.upsert({
    where: { phone: "79001111111" },
    create: { phone: "79001111111", passwordHash, name: "Пётр Клиентов", role: "customer" },
    update: { passwordHash, name: "Пётр Клиентов", role: "customer" },
  });

  const client2 = await prisma.user.upsert({
    where: { phone: "79002222222" },
    create: { phone: "79002222222", passwordHash, name: "Ольга Заказова", role: "customer" },
    update: { passwordHash, name: "Ольга Заказова", role: "customer" },
  });

  // --- Italiano: категории и блюда ---
  const catR1Main = await ensureCategory(r1.id, "Основные блюда", "Паста и горячее");
  await ensureProduct(catR1Main.id, { title: "Карбонара", description: "Спагетти, бекон, яйцо, пармезан", price: 420, imageUrl: IMG.pasta });
  await ensureProduct(catR1Main.id, { title: "Болоньезе", description: "Спагетти с мясным соусом", price: 380, imageUrl: IMG.pasta });
  await ensureProduct(catR1Main.id, { title: "Пицца Маргарита", description: "Томаты, моцарелла, базилик", price: 450, imageUrl: IMG.pizza });
  await ensureProduct(catR1Main.id, { title: "Пицца Пепперони", description: "Острая салями, сыр", price: 520, imageUrl: IMG.pizza });

  const catR1Drinks = await ensureCategory(r1.id, "Напитки", "Кофе и соки");
  await ensureProduct(catR1Drinks.id, { title: "Эспрессо", description: "30 мл", price: 120, imageUrl: IMG.coffee });
  await ensureProduct(catR1Drinks.id, { title: "Капучино", description: "200 мл", price: 180, imageUrl: IMG.coffee });
  await ensureProduct(catR1Drinks.id, { title: "Свежевыжатый апельсин", description: "300 мл", price: 250, imageUrl: IMG.juice });

  const catR1Dessert = await ensureCategory(r1.id, "Десерты", "Сладкое");
  await ensureProduct(catR1Dessert.id, { title: "Тирамису", description: "Классический итальянский десерт", price: 320, imageUrl: IMG.cake });
  await ensureProduct(catR1Dessert.id, { title: "Панна-котта", description: "С ягодным соусом", price: 280, imageUrl: IMG.cake });

  // --- Burger House ---
  const catR2Main = await ensureCategory(r2.id, "Бургеры и стейки", "Горячее");
  await ensureProduct(catR2Main.id, { title: "Чизбургер", description: "Говядина, сыр, соус", price: 350, imageUrl: IMG.burger });
  await ensureProduct(catR2Main.id, { title: "Двойной бургер", description: "Две котлеты, бекон", price: 480, imageUrl: IMG.burger });
  await ensureProduct(catR2Main.id, { title: "Стейк Рибай", description: "300 г, картофель", price: 890, imageUrl: IMG.steak });
  await ensureProduct(catR2Main.id, { title: "Салат Цезарь", description: "Курица, пармезан, соус", price: 320, imageUrl: IMG.salad });

  const catR2Soup = await ensureCategory(r2.id, "Супы", "Горячие супы");
  await ensureProduct(catR2Soup.id, { title: "Том Ям", description: "Острый тайский суп с креветками", price: 380, imageUrl: IMG.soup });
  await ensureProduct(catR2Soup.id, { title: "Тыквенный крем-суп", description: "С гренками", price: 280, imageUrl: IMG.soup });

  // --- Сакура ---
  const catR3Main = await ensureCategory(r3.id, "Суши и роллы", "Классика японской кухни");
  await ensureProduct(catR3Main.id, { title: "Ролл Филадельфия", description: "Лосось, сливочный сыр, огурец", price: 420, imageUrl: IMG.sushi });
  await ensureProduct(catR3Main.id, { title: "Ролл Дракон", description: "Угорь, огурец, икра", price: 480, imageUrl: IMG.sushi });
  await ensureProduct(catR3Main.id, { title: "Суши с лососем", description: "6 шт", price: 320, imageUrl: IMG.sushi });
  await ensureProduct(catR3Main.id, { title: "Сет Сакура", description: "20 роллов ассорти", price: 1200, imageUrl: IMG.sushi });

  // --- Расписание ---
  for (const rest of [r1, r2, r3]) {
    const existing = await prisma.menuSchedule.count({ where: { restaurantId: rest.id } });
    if (existing === 0) {
      for (let day = 0; day <= 6; day++) {
        await prisma.menuSchedule.create({
          data: { restaurantId: rest.id, dayOfWeek: day, openTime: "10:00", closeTime: "23:00" },
        });
      }
    }
  }

  // --- Тестовые брони ---
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);
  const endTomorrow = new Date(tomorrow);
  endTomorrow.setHours(21, 0, 0, 0);

  const resCount = await prisma.reservation.count();
  if (resCount === 0) {
    await prisma.reservation.create({
      data: { restaurantId: r1.id, userId: client1.id, status: "new", startTime: tomorrow, endTime: endTomorrow, personsCount: 2 },
    });
    await prisma.reservation.create({
      data: { restaurantId: r2.id, userId: client2.id, status: "confirmed", startTime: tomorrow, endTime: endTomorrow, personsCount: 4 },
    });
  }

  console.log("\n--- Seed выполнен ---");
  console.log("Рестораны: Italiano, Burger House, Сакура");
  console.log("Пароль для всех аккаунтов:", DEFAULT_PASSWORD);
  console.log("Список аккаунтов: см. TEST_ACCOUNTS.md");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
