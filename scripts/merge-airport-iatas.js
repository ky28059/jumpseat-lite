const { PrismaClient } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

    const users = await prisma.user.findMany();
    for (const user of users) {
        if (!user.airportIATA) continue;

        console.log(user.firstName + ' ' + user.lastName + ' ' + user.email);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                airports: [...new Set([...user.airports, user.airportIATA])],
                airportIATA: null
            }
        })
    }
})()
