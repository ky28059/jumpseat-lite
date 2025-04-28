const { PrismaClient, BreakType } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'UIUC';

    const schoolData = {
        schoolName,
        // airportIatas: ['ORD', 'MDW'],
        breaks: {
            createMany: {
                data: [
                    { defaultStartDate: new Date('2024-11-23'), defaultEndDate: new Date('2024-12-01'), breakType: BreakType.Fall },
                    { defaultStartDate: new Date('2024-12-20'), defaultEndDate: new Date('2025-01-20'), breakType: BreakType.Winter },
                    { defaultStartDate: new Date('2025-03-15'), defaultEndDate: new Date('2025-03-23'), breakType: BreakType.Spring },
                    { defaultStartDate: new Date('2025-05-16'), defaultEndDate: new Date('2025-08-24'), breakType: BreakType.Summer },
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
