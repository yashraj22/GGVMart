// import { PrismaClient } from "@prisma/client/extension";
import prisma from "../../../util/prismaClient";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const product = await prisma.product.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ product: product }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating message:", error);

    return new NextResponse(JSON.stringify({ error }));
  }
}
