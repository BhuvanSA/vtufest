// scripts/createUser.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser() {
    try {
        const newUser = await prisma.university.create({
            data: {
                username: "testuser",
                password: "testpassword123", // In production, ensure this is hashed
            },
        });

        console.log("Created user:", newUser);
    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
