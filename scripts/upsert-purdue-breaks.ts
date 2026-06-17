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
            { startDate: new Date('2026-10-10'), endDate: new Date('2026-10-13'), breakType: BreakType.Fall, schoolID: school.id },
            { startDate: new Date('2026-11-25'), endDate: new Date('2026-11-29'), breakType: BreakType.Thanksgiving, schoolID: school.id },
            { startDate: new Date('2026-12-19'), endDate: new Date('2027-01-10'), breakType: BreakType.Winter, schoolID: school.id },
            { startDate: new Date('2027-03-13'), endDate: new Date('2027-03-21'), breakType: BreakType.Spring, schoolID: school.id },
            { startDate: new Date('2026-05-09'), endDate: new Date('2026-08-23'), breakType: BreakType.Summer, schoolID: school.id },
        ]
    })
    console.log(breaks);
}

main().finally(async () => {
    await prisma.$disconnect();
})
