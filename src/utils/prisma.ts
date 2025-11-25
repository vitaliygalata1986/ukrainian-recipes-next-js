import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/*
Бдагодаря это решению мы избегаем создания множества экземпляров PrismaClient во время разработки, что может привести к исчерпанию соединений с базой данных.
Этот паттерн имеет наименование "singleton pattern".

*/
