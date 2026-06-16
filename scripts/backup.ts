import "dotenv/config";
import { PrismaClient } from '@/generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { writeFile } from 'node:fs/promises';


const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());

async function main() {
    for (const table of Object.keys(prisma)) {
        const delegate = prisma[table as keyof typeof prisma];
        if (!('findMany' in delegate)) continue;

        console.log(table)

        const data = await delegate.findMany();
        await writeFile(`./backup/${table}.json`, JSON.stringify(data, null, 4));
    }
}

main().finally(async () => {
    await prisma.$disconnect();
});
