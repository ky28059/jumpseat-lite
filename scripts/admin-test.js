const { PrismaClient } = require('@prisma/client');


;(async () => {
    const prisma = new PrismaClient();

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
})()
