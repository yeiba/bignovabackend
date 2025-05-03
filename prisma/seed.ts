import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await prisma.dish.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Database cleared");

    // Create users with hashed passwords
    const hashedPassword = await hash("password123", 10);

    const john = await prisma.user.create({
      data: {
        name: "John Smith",
        email: "john@example.com",
        password: hashedPassword,
        role: Role.admin,
        avatar: {
          imageUrl:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
          altText: "admin avatar",
        }, // Direct URL for avatar
      },
    });

    const jane = await prisma.user.create({
      data: {
        name: "Jane Doe",
        email: "jane@example.com",
        password: hashedPassword,
        role: Role.user,
        avatar: {
          imageUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          altText: "user avatar",
        }, // Direct URL for avatar
      },
    });

    const chef = await prisma.user.create({
      data: {
        name: "Chef Gordon",
        email: "gordon@example.com",
        password: hashedPassword,
        role: Role.cheff,
        avatar: {
          imageUrl:
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857",
          altText: "  chef avatar",
        }, // Direct URL for avatar
      },
    });

    console.log("Created users");

    // Create categories
    const italian = await prisma.category.create({
      data: {
        name: "Italian",
        description: "Italian cuisine with pasta, pizza and more",
        userId: john.id,
        image: {
          imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554",
          altText: "Italian category image",
        }, // Direct URL for category image
      },
    });

    const japanese = await prisma.category.create({
      data: {
        name: "Japanese",
        description: "Sushi, ramen, and other Japanese delicacies",
        userId: john.id,
        image: {
          imageUrl:
            "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
          altText: "Japanese category image",
        }, // Direct URL for category image
      },
    });

    const mexican = await prisma.category.create({
      data: {
        name: "Mexican",
        description: "Tacos, burritos, and authentic Mexican cuisine",
        userId: john.id,
        image: {
          imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b",
          altText: "Mexican",
        }, // Direct URL for category image
      },
    });

    const indian = await prisma.category.create({
      data: {
        name: "Indian",
        description: "Flavorful curries and Indian specialties",
        userId: john.id,
        image: {
          imageUrl:
            "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
          altText: "Indian",
        }, // Direct URL for category image
      },
    });

    console.log("Created categories");

    // Create restaurants
    const pastaParadise = await prisma.restaurant.create({
      data: {
        name: "Pasta Paradise",
        address: "123 Main St, New York",
        ownerId: john.id,
        categoryId: italian.id,
        banner: {
          imageUrl: "https://images.unsplash.com/photo-1545247181-516773cae754",
          altText: "Pasta",
        }, // Direct URL for banner
      },
    });

    const sushiSupreme = await prisma.restaurant.create({
      data: {
        name: "Sushi Supreme",
        address: "456 Oak Ave, Los Angeles",
        ownerId: john.id,
        categoryId: japanese.id,
        banner: {
          imageUrl:
            "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
          altText: "Sushi",
        }, // Direct URL for banner
      },
    });

    const tacoTown = await prisma.restaurant.create({
      data: {
        name: "Taco Town",
        address: "789 Pine Blvd, Miami",
        ownerId: jane.id,
        categoryId: mexican.id,
        banner: {
          imageUrl:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
          altText: "Taco",
        }, // Direct URL for banner
      },
    });

    const curryCorner = await prisma.restaurant.create({
      data: {
        name: "Curry Corner",
        address: "101 Elm St, Chicago",
        ownerId: jane.id,
        categoryId: indian.id,
        banner: {
          imageUrl:
            "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b",
          altText: "Curry",
        }, // Direct URL for banner
      },
    });

    console.log("Created restaurants");

    // Create menus
    const pastaParadiseLunch = await prisma.menu.create({
      data: {
        name: "Lunch Menu",
        restaurantId: pastaParadise.id,
      },
    });

    const pastaParadiseDinner = await prisma.menu.create({
      data: {
        name: "Dinner Menu",
        restaurantId: pastaParadise.id,
      },
    });

    const sushiSupremeSpecial = await prisma.menu.create({
      data: {
        name: "Special Menu",
        restaurantId: sushiSupreme.id,
      },
    });

    const tacoTownLunch = await prisma.menu.create({
      data: {
        name: "Lunch Specials",
        restaurantId: tacoTown.id,
      },
    });

    console.log("Created menus");

    // Create dishes with image arrays
    const spaghetti = await prisma.dish.create({
      data: {
        name: "Spaghetti Carbonara",
        description:
          "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
        price: 14.99,
        menuId: pastaParadiseLunch.id,
        categoryId: italian.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
            altText: "Spaghetti Carbonara",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1546549032-9571cd6b27df",
            altText: "Spagitti",
          },
        ], // Array of image URLs
      },
    });

    const pizza = await prisma.dish.create({
      data: {
        name: "Margherita Pizza",
        description:
          "Traditional pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        menuId: pastaParadiseLunch.id,
        categoryId: italian.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            altText: "Spaghetti Carbonara",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
            altText: "Spagitti",
          },
        ],
      },
    });

    const californiaRoll = await prisma.dish.create({
      data: {
        name: "California Roll",
        description: "Sushi roll with crab, avocado, and cucumber",
        price: 8.99,
        menuId: sushiSupremeSpecial.id,
        categoryId: japanese.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            altText: "Spaghetti Carbonara",
          },
        ],
      },
    });

    const tacos = await prisma.dish.create({
      data: {
        name: "Beef Tacos",
        description:
          "Three soft tacos with seasoned beef, lettuce, cheese, and salsa",
        price: 9.99,
        menuId: tacoTownLunch.id,
        categoryId: mexican.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
            altText: "Spaghetti Carbonara",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            altText: "Spagitti",
          },
        ],
      },
    });

    const tikka = await prisma.dish.create({
      data: {
        name: "Chicken Tikka Masala",
        description: "Tender chicken in a rich, spiced tomato cream sauce",
        price: 15.99,
        categoryId: indian.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
            altText: "Spaghetti Carbonara",
          },
        ],
      },
    });

    const fettuccine = await prisma.dish.create({
      data: {
        name: "Fettuccine Alfredo",
        description: "Pasta in a creamy Parmesan cheese sauce",
        price: 13.99,
        menuId: pastaParadiseDinner.id,
        categoryId: italian.id,
        images: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1556761223-4c4282c73f77",
            altText: "Spaghetti Carbonara",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1579349443343-73adc04a4285",
            altText: "Spagitti",
          },
        ],
      },
    });

    console.log("Created dishes");
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
