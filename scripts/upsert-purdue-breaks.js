const { PrismaClient, BreakType } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'Purdue';

    const schoolData = {
        schoolName,
        airportIatas: ['IND', 'ORD'],
        breaks: {
            createMany: {
                data: [
                    { defaultStartDate: new Date('2025-10-11'), defaultEndDate: new Date('2025-10-14'), breakType: BreakType.Fall },
                    { defaultStartDate: new Date('2025-12-20'), defaultEndDate: new Date('2026-01-11'), breakType: BreakType.Winter },
                    { defaultStartDate: new Date('2026-03-14'), defaultEndDate: new Date('2026-03-22'), breakType: BreakType.Spring },
                    { defaultStartDate: new Date('2026-05-09'), defaultEndDate: new Date('2026-08-24'), breakType: BreakType.Summer },
                ]
            }
        }
    }

    const school = await prisma.school.upsert({
        where: { schoolName },
        create: schoolData,
        update: schoolData
    });
    console.log(school)
})()
