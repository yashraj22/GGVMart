import prisma from "../../util/prismaClient";

export async function GET(req: Request) {
  const products = await prisma.product.findMany();
  return Response.json({ products });
}
