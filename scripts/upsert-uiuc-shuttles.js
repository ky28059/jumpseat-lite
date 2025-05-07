const { PrismaClient, Direction } = require('@prisma/client');


const peoriaRoutes = [{
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T05:00Z'),
    arrTime: new Date('1970-01-01T08:55Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T07:00Z'),
    arrTime: new Date('1970-01-01T10:55Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CU-0800, no tues/wed?
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T08:00Z'),
    arrTime: new Date('1970-01-01T11:55Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T10:00Z'),
    arrTime: new Date('1970-01-01T13:55Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CX-0700, no tues/wed?
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T12:00Z'),
    arrTime: new Date('1970-01-01T15:40Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T14:00Z'),
    arrTime: new Date('1970-01-01T17:55Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CX-1200, no tues/wed/sat?
    direction: Direction.fromSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T17:30Z'),
    arrTime: new Date('1970-01-01T20:35Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.fromSchool,
    airport: 'MDW',
    depTime: new Date('1970-01-01T05:00Z'),
    arrTime: new Date('1970-01-01T08:05Z'),
    price: 46,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CX-0700, no tues/wed?
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T07:00Z'),
    arrTime: new Date('1970-01-01T09:45Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T10:30Z'),
    arrTime: new Date('1970-01-01T14:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CX-1200, no tues/wed/sat?
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T12:00Z'),
    arrTime: new Date('1970-01-01T15:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T12:30Z'),
    arrTime: new Date('1970-01-01T16:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, { // TODO: CU-0800, no tues/wed?
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T13:30Z'),
    arrTime: new Date('1970-01-01T17:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T15:30Z'),
    arrTime: new Date('1970-01-01T19:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'ORD',
    depTime: new Date('1970-01-01T19:30Z'),
    arrTime: new Date('1970-01-01T23:30Z'),
    price: 45,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}, {
    direction: Direction.toSchool,
    airport: 'MDW',
    depTime: new Date('1970-01-01T13:30Z'),
    arrTime: new Date('1970-01-01T16:30Z'),
    price: 46,
    depTimeZone: 'America/Chicago',
    arrTimeZone: 'America/Chicago',
}];

;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'UIUC';
    const school = await prisma.school.findFirst({ where: { schoolName } });

    await prisma.shuttleTime.deleteMany({
        where: { provider: { is: { schoolID: school.id } } }
    });

    const peoriaData = {
        school: { connect: { id: school.id } },
        name: 'Peoria Charter',
        bookingUrl: 'https://lafayettelimo.bookingtool.net/v2/index.php?file=b-shuttle',
        iconUrl: '/assets/shuttle-logos/peoria.png',
        shuttleTimes: {
            createMany: { data: peoriaRoutes }
        }
    };

    console.log(await prisma.shuttleProvider.upsert({
        where: { name_schoolID: { name: 'Peoria Charter', schoolID: school.id } },
        create: peoriaData,
        update: peoriaData,
    }));
})()
