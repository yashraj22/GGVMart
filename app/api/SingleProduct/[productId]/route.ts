// import { PrismaClient } from "@prisma/client";
import prisma from "../../../util/prismaClient";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  props: { params: Promise<{ productId: string }> },
) {
  const params = await props.params;
  const productId = params.productId;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  return NextResponse.json({ product });
}
