import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const products = await prisma.product.findMany();
  return Response.json({ products });
}
