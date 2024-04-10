import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const userId = params.userId;
  const products = await prisma.product.findMany({
    where: {
      ownerId: {
        equals: userId,
      },
    },
  });
  console.log(products);
  return Response.json({ products });
}
