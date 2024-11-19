const prisma = require("../prisma");

const seed = async () => {
  const numRestaurants = 3
  const numCustomers = 5
  const numReservations = 8

  const restaurants = Array.from({ length: numRestaurants }, (_, i) => ({
    name: `Restaurants ${i + 1}`,
  }));
  await prisma.restaurant.createMany({ data: restaurants})

  const customers = Array.from({ length: numCustomers}, (_, i) => ({
    name: `Customer ${i + 1}`,
    email: `customer${i +1}@foo.bar`,
  }));
  await prisma.customer.createMany({ data: customers})

  for (i = 0; i < numReservations; i++) {
    const partySize = 1 + Math.floor(Math.random() * 3);

    const party = Array.from({ length: partySize }, () => ({
      id: 1 + Math.floor(Math.random() * numCustomers),
    }));
    await prisma.reservation.create({
      data: { 
        date: new Date().toDateString(),
        restaurantId: 1 + Math.floor(Math.random() * numRestaurants),
        party: {connect: party },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
