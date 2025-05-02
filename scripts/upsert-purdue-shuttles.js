const { PrismaClient, Direction } = require('@prisma/client');


const lafLimoRoutes = [{
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T04:30Z'),
    arrTime: new Date('1970-01-01T06:40Z'),
    price: 55,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T10:30Z'),
    arrTime: new Date('1970-01-01T12:40Z'),
    price: 55,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T15:30Z'),
    arrTime: new Date('1970-01-01T17:40Z'),
    price: 55,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T08:00Z'),
    arrTime: new Date('1970-01-01T12:00Z'),
    price: 55,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T14:00Z'),
    arrTime: new Date('1970-01-01T18:00Z'),
    price: 55,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T19:00Z'),
    arrTime: new Date('1970-01-01T23:00Z'),
    price: 55,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T04:45Z'),
    arrTime: new Date('1970-01-01T06:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T06:45Z'),
    arrTime: new Date('1970-01-01T08:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T08:45Z'),
    arrTime: new Date('1970-01-01T10:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T10:45Z'),
    arrTime: new Date('1970-01-01T12:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T12:45Z'),
    arrTime: new Date('1970-01-01T14:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T14:45Z'),
    arrTime: new Date('1970-01-01T16:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T16:45Z'),
    arrTime: new Date('1970-01-01T18:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T18:45Z'),
    arrTime: new Date('1970-01-01T20:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.fromSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T20:45Z'),
    arrTime: new Date('1970-01-01T22:30Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T06:30Z'),
    arrTime: new Date('1970-01-01T08:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T08:30Z'),
    arrTime: new Date('1970-01-01T10:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T10:30Z'),
    arrTime: new Date('1970-01-01T12:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T12:30Z'),
    arrTime: new Date('1970-01-01T14:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T14:30Z'),
    arrTime: new Date('1970-01-01T16:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T16:30Z'),
    arrTime: new Date('1970-01-01T18:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T18:30Z'),
    arrTime: new Date('1970-01-01T20:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T20:30Z'),
    arrTime: new Date('1970-01-01T22:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}, {
    direction: Direction.toSchool,
    airport: 'IND',
    depTime: new Date('1970-01-01T22:30Z'),
    arrTime: new Date('1970-01-01T00:10Z'),
    price: 25,
    depTimeZone: 'America/Indianapolis',
    arrTimeZone: 'America/Indianapolis',
}];

const reindeerRoutes = [];

;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'Purdue';
    const school = await prisma.school.findFirst({ where: { schoolName } });

    await prisma.shuttleTime.deleteMany(); // TODO?

    const lafData = {
        school: { connect: { id: school.id } },
        name: 'Lafayette Limo',
        bookingUrl: 'https://lafayettelimo.bookingtool.net/v2/index.php?file=b-shuttle',
        iconUrl: '/assets/shuttle-logos/LL.jpg',
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
        iconUrl: '/assets/shuttle-logos/RS.jpg',
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
