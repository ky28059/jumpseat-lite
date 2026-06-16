import "dotenv/config";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient, BreakType } from "../generated/prisma/client";


const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());

async function main() {
    // Should be a valid name defined in `schoolConfigs`.
    const schoolName = 'Purdue';

    const schoolData = {
        schoolName,
        airportIatas: ['IND', 'ORD']
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
            { startDate: new Date('2025-10-11'), endDate: new Date('2025-10-14'), breakType: BreakType.Fall, schoolID: school.id },
            { startDate: new Date('2025-11-26'), endDate: new Date('2025-11-30'), breakType: BreakType.Thanksgiving, schoolID: school.id },
            { startDate: new Date('2025-12-20'), endDate: new Date('2026-01-11'), breakType: BreakType.Winter, schoolID: school.id },
            { startDate: new Date('2026-03-14'), endDate: new Date('2026-03-22'), breakType: BreakType.Spring, schoolID: school.id },
            { startDate: new Date('2026-05-09'), endDate: new Date('2026-08-23'), breakType: BreakType.Summer, schoolID: school.id },
        ]
    })
    console.log(breaks);
}

main().finally(async () => {
    await prisma.$disconnect();
})
