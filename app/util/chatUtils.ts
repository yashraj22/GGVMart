import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export const fetchMessages = async () => {
  await fetch("/api/product");
};

export const createChatRoom = async (req: Request, res: Response) => {
  try {
    const data = await req.json();
    console.log(req);
    const { title, category, ownerId } = data;

    console.log(data);

    // Create the message in the database
    const product = await prisma.product.create({
      data: {
        title: title, // Replace with your actual product title
        category: category, // Replace with your actual product category
        owner: {
          connect: {
            id: ownerId, // Replace with the actual owner id
          },
        },
      },
    });

    // Return a success response with the created message data
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    // Return a JSON response with an error message and status 500
  }
};
