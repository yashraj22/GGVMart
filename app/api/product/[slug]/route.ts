// pages/api/product/[id].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug: any = params.slug;
  const id = slug;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  const ownerId = product.ownerId;

  return new Response(JSON.stringify({ ownerId: ownerId }));
}
