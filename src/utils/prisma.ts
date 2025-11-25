import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

/*
Бдагодаря это решению мы избегаем создания множества экземпляров PrismaClient во время разработки, что может привести к исчерпанию соединений с базой данных.
Этот паттерн имеет наименование "singleton pattern".

*/
