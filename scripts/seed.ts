import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                {name: "Женщины"},
                {name: "Мужчины"},
                {name: "18+"},
                {name: "Изменяющие"},
                {name: "Малышки"},
                {name: "Верные"},
            ]
        })
      } catch (error) {
        console.error("Error seeding default categories", error);
      } finally {
        await db.$disconnect();
      }
    };

main();    