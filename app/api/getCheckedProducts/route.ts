import prisma from "../../util/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Invalid product IDs" },
        { status: 400 },
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
