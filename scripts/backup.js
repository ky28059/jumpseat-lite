const { PrismaClient } = require('@prisma/client');
const { writeFile } = require('node:fs/promises');


;(async () => {
    const prisma = new PrismaClient();

    for (const table in prisma) {
        if (table.startsWith('_') || table.startsWith('$')) continue;
        console.log(table)

        const data = await prisma[table].findMany();
        await writeFile(`./backup/${table}.json`, JSON.stringify(data, null, 4));
    }
})()
