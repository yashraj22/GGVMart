import { NextResponse } from "next/server";
import prisma from "../../util/prismaClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      select: { productId: true },
    });

    const productIds = [...new Set(chats.map((chat) => chat.productId))];

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const orderedProducts = productIds
      .map((productId) => productsById.get(productId))
      .filter(Boolean);

    return NextResponse.json({ products: orderedProducts });
  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching recently viewed products" },
      { status: 500 },
    );
  }
}
