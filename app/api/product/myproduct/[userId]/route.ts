// import { PrismaClient } from "@prisma/client";
import prisma from "../../../../util/prismaClient";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

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
  return NextResponse.json({ products });
}
