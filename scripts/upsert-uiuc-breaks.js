const { PrismaClient, BreakType } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'UIUC';

    const schoolData = {
        schoolName,
        airportIatas: ['ORD', 'MDW']
    }

    const school = await prisma.school.upsert({
        where: { schoolName },
        create: schoolData,
        update: schoolData
    });
    console.log(school);

    await prisma.break.deleteMany({
        where: { school: { is: { id: school.id } } }
    });

    const breaks = await prisma.break.createMany({
        data: [
            { startDate: new Date('2025-11-22'), endDate: new Date('2025-11-30'), breakType: BreakType.Fall, schoolID: school.id },
            { startDate: new Date('2025-12-19'), endDate: new Date('2026-01-19'), breakType: BreakType.Winter, schoolID: school.id },
            { startDate: new Date('2026-03-14'), endDate: new Date('2026-03-22'), breakType: BreakType.Spring, schoolID: school.id },
            { startDate: new Date('2026-05-15'), endDate: new Date('2026-08-23'), breakType: BreakType.Summer, schoolID: school.id },
        ]
    })
    console.log(breaks);
})()
