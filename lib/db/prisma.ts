import { PrismaClient } from "@/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function createPrismaClient() {
    return new PrismaClient({
        accelerateUrl: process.env.DATABASE_URL!,
    }).$extends(withAccelerate());
}

const globalForPrisma = global as unknown as {
    prisma: ReturnType<typeof createPrismaClient>;
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
