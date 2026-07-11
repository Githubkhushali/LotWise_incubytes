const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const vehicles = [
    { make: 'Porsche', model: 'Taycan Turbo S', category: 'performance', price: 185000, quantity: 2 },
    { make: 'Porsche', model: 'Cayenne GTS', category: 'suv', price: 125000, quantity: 5 },
    { make: 'Mercedes-Benz', model: 'S-Class', category: 'sedan', price: 114000, quantity: 3 },
    { make: 'Mercedes-Benz', model: 'G 63 AMG', category: 'suv', price: 179000, quantity: 1 },
    { make: 'Audi', model: 'RS e-tron GT', category: 'performance', price: 142000, quantity: 4 },
    { make: 'Audi', model: 'Q8', category: 'suv', price: 73000, quantity: 7 },
    { make: 'BMW', model: 'M5 Competition', category: 'performance', price: 138000, quantity: 2 },
    { make: 'BMW', model: 'X7', category: 'suv', price: 81000, quantity: 6 },
    { make: 'Lexus', model: 'LS 500h', category: 'sedan', price: 113000, quantity: 3 },
    { make: 'Tesla', model: 'Model S Plaid', category: 'sedan', price: 89000, quantity: 8 },
  ];

  console.log('Seeding vehicles...');
  
  for (const v of vehicles) {
    const created = await prisma.vehicle.create({
      data: v
    });
    console.log(`Created ${created.make} ${created.model}`);
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
