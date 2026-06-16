import "dotenv/config";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../generated/prisma/client";


const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());

async function main() {
    const user = await prisma.user.update({
        where: {
            email: 'yu1271@purdue.edu'
        },
        data: {
            firstName: 'Kevin',
            lastName: 'Yu',
            isAdmin: true
        }
    });
    console.log(user)
}

main().finally(async () => {
    await prisma.$disconnect();
});
