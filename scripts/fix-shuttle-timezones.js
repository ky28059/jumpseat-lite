const { PrismaClient } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

    const times = await prisma.shuttleTime.findMany();
    for (const time of times) {
        console.log(time.id);

        await prisma.shuttleTime.update({
            where: { id: time.id },
            data: {
                arrTimeZone: colloquialToTz(time.arrTimeZone),
                depTimeZone: colloquialToTz(time.depTimeZone)
            }
        })
    }
})()

function colloquialToTz(str) {
    if (str === 'Central') return 'America/Chicago';
    if (str === 'Eastern') return 'America/Indianapolis';
    throw new Error(`Unknown timezone string: ${str}`)
}
