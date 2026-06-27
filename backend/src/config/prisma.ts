// import { PrismaClient } from '../generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma;
// }


import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const globalForPrisma =
  globalThis as unknown as {
    prisma?: PrismaClient;
  };


function createPrismaClient() {

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing"
    );
  }


  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });


  return new PrismaClient({
    adapter,
  });
}



export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();



if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}