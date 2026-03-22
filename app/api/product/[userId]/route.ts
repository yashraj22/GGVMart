import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../util/prismaClient";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  const id: string = params.userId;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return new NextResponse(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  const ownerId = product.ownerId;

  return new NextResponse(JSON.stringify({ ownerId: ownerId }));
}
