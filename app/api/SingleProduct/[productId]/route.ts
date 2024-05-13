// import { PrismaClient } from "@prisma/client";
import prisma from "../../../util/prismaClient";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }, // Changed userId to productId
) {
  const productId = params.productId; // Changed userId to productId
  const product = await prisma.product.findUnique({
    // Changed findMany to findUnique to fetch a single product
    where: {
      id: productId, // Changed ownerId to id to match the product id
    },
  });
  return NextResponse.json({ product }); // Return a single product instead of an array
}
