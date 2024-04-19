import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, category, id, imagess } = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: title,
        category: category,
        images: imagess,
      },
    });
    return new NextResponse(JSON.stringify({ product: product }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating message:", error);

    return new NextResponse(JSON.stringify({ error }));
  }
}
