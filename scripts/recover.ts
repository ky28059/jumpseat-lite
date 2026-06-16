import "dotenv/config";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client";
import { readdir, readFile } from 'node:fs/promises';


const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());

async function main() {
    async function backupFile(file: string) {
        const table = file.slice(0, -5);

        console.log(table)

        const data = JSON.parse((await readFile(`./backup/${file}`)).toString());

        // @ts-ignore
        await prisma[table].createMany({
            data
        })
    }

    const files = (await readdir('./backup')).filter(file => file !== 'school.json' && file !== 'user.json' && file !== 'break.json' && file !== 'friend.json');
    await Promise.all(files.map(backupFile));

    // await backupFile('school.json')
    // await backupFile('user.json')
    // await backupFile('break.json')
    // await backupFile('friend.json')
}

main().finally(async () => {
    await prisma.$disconnect();
});
