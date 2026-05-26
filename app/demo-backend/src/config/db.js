import {PrismaClient} from "@prisma/client/extension";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log(`DB Connected via prisma`);
    }catch (error) {
        console.error(`DB Connected error: ${error}`);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };