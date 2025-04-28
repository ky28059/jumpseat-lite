const { PrismaClient } = require('@prisma/client');
const { readdir, readFile } = require('node:fs/promises');


;(async () => {
    const prisma = new PrismaClient();

    async function backupFile(file) {
        const table = file.slice(0, -5);
        console.log(table)

        const data = JSON.parse((await readFile(`./backup/${file}`)).toString());
        await prisma[table].createMany({
            data
        })
    }

    const files = (await readdir('./backup')).filter(file => file !== 'school.json' && file !== 'user.json' && file !== 'break.json' && file !== 'friend.json');
    files.forEach(backupFile);

    // await backupFile('school.json')
    // await backupFile('user.json')
    // await backupFile('break.json')
    // await backupFile('friend.json')
})()
