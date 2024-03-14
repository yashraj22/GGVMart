import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { NextResponse } from "next/server";
import { useId } from "react";

export async function POST(request: Request) {
  console.log("====================================");
  console.log("hello from api");
  console.log("====================================");
  try {
    const { userId, productId } = await request.json();

    // Create the message in the database
    const chat = await prisma.chat.create({
      data: {
        userId: userId, // Assuming userId is available in the request body
        productId: productId, // Assuming productId is available in the request body
      },
    });

    // Return a success response with the created message data
    return new Response(JSON.stringify({ chat, status: 201 }));
  } catch (error) {
    console.error("Error creating message:", error);
    // Return a JSON response with an error message and status 500

    return new Response(JSON.stringify({ useId, status: 500 }));
  }
}
