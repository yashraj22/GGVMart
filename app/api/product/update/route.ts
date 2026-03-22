// import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "../../../util/prismaClient";

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, category, price, description, id, images } =
      await req.json();
    const data: {
      title?: string;
      category?: string;
      price?: string;
      description?: string;
      images?: string[];
    } = {};

    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category;
    if (price !== undefined) data.price = price;
    if (description !== undefined) data.description = description;
    if (images !== undefined) data.images = images;

    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return new NextResponse(JSON.stringify({ product: product }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating message:", error);

    return new NextResponse(JSON.stringify({ error }));
  }
}
