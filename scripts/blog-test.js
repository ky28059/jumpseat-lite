const { PrismaClient, BlogCategory } = require('@prisma/client');


const content = `Deciding on an airport? Well, it depends. If you're an international student, the choice is practically made for you: ORD. For domestic flyers, though ORD often offers cheaper flights, it really hinges on where you’re headed—so make sure to do a quick search at [boilerbookings.com/search](https://boilerbookings.com/search) to check flights to your home airport. But if your priority is saving time and there are direct flights to your destination from IND, then IND is your best bet.

Booking your trip home from Purdue involves a few steps: choose your airport, find a flight to your home city, and then align your shuttle services accordingly. This used to be quite the jigsaw puzzle before [BoilerBookings](https://boilerbookings.com/) made it simple to list all your options and find the best combo from both airports. However, if you're trying to pin down a go-to airport, there are a few things to consider.

For context, ORD is Chicago O'Hare International Airport, and IND is Indianapolis International Airport. ORD is significantly larger and busier than IND and serves as a hub for United flights, making them more frequent and less expensive from there. The dining options at ORD are also more extensive and generally superior—useful info if you have a lengthy shuttle-flight layover and need to grab a bite. Personally, I prefer flying out of IND whenever possible because it's much closer to campus—saving about two hours on shuttle rides—and getting through security and to your gate is usually quicker due to its smaller size and fewer crowds. However, the cost factor often tilts me back towards ORD more often than I'd like. Fortunately, both major shuttle services from Purdue’s campus ([Lafayette Limo](http://lafayettelimo.com) and [Reindeer Shuttle](https://www.reindeershuttle.com/)), serve both airports. The newcomer shuttle service ([Go Express](http://goexpresstravel.com/lafayette-shuttle)) travels to IND from campus.

If you have any questions or thoughts, please reach out at team@boilerbookings.com. Thanks for reading!`;


;(async () => {
    const prisma = new PrismaClient();

    // Create user and blog post if they don't exist.
    // https://stackoverflow.com/a/71524587
    const user = await prisma.user.upsert({
        where: {
            email: 'team@jumpseatapp.com'
        },
        update: {},
        create: {
            email: 'team@jumpseatapp.com',
            password: 'admin',
            firstName: 'Rithwik',
            lastName: 'Erabelly'
        }
    });

    const blogData = {
        id: 'which-airport',
        title: 'Which airport should I fly out of from Purdue? ORD or IND?',
        image: 'https://picsum.photos/seed/17/1600/1200', // TODO
        preview: 'The best airport to get home from Purdue’s campus as an out-of-state student.',
        content,
        category: BlogCategory.Travel,
        createdAt: new Date('2024-04-21'),
        author: {
            connect: { id: user.id }
        }
    }
    const blog = await prisma.blogPost.upsert({
        where: {
            id: blogData.id,
        },
        update: blogData,
        create: blogData
    })
    console.log(blog)
})()
