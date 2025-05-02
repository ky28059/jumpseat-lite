const { PrismaClient, Direction } = require('@prisma/client');


const lafLimoRoutes = [{
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T04:30Z'),
    arrTime: new Date('1970-01-01T06:40Z'),
    price: 55,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Chicago',
}];

const reindeerRoutes = [];

;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'Purdue';
    const school = await prisma.school.findFirst({ where: { schoolName } });

    const lafData = {
        school: { connect: { id: school.id } },
        name: 'Lafayette Limo',
        bookingUrl: 'https://lafayettelimo.bookingtool.net/v2/index.php?file=b-shuttle',
        iconUrl: '/assets/shuttle-logos/RS.jpg',
        shuttleTimes: {
            createMany: { data: lafLimoRoutes }
        }
    };

    console.log(await prisma.shuttleProvider.upsert({
        where: { name_schoolID: { name: 'Lafayette Limo', schoolID: school.id } },
        create: lafData,
        update: lafData,
    }));

    const reinData = {
        school: { connect: { id: school.id } },
        name: 'Reindeer Shuttle',
        bookingUrl: 'https://www.reindeershuttle.com/book-now/',
        iconUrl: '/assets/shuttle-logos/LL.jpg',
        shuttleTimes: {
            createMany: { data: reindeerRoutes }
        }
    }

    console.log(await prisma.shuttleProvider.upsert({
        where: { name_schoolID: { name: 'Reindeer Shuttle', schoolID: school.id } },
        create: reinData,
        update: reinData,
    }));
})()
