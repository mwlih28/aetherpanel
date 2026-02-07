import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await argon2.hash(process.env.ADMIN_PASSWORD || 'admin123');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@aether.panel' },
        update: {
            password: adminPassword,
        },
        create: {
            username: 'admin',
            email: 'admin@aether.panel',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    console.log('Seeded Admin User:', admin.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
