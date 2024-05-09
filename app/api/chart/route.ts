// import { PrismaClient } from "@prisma/client";
import prisma from "../../util/prismaClient";

// const prisma = new PrismaClient();
import { useId } from "react";

export async function POST(request: Request) {
  console.log("====================================");
  console.log("hello from api");
  console.log("====================================");
  var chat: {
    id: string;
    userId: string;
    productId: string;
  } = { id: "", userId: "", productId: "" };
  try {
    const { userId, productId } = await request.json();

    const chatExists = await prisma.chat.findFirst({
      where: {
        productId: productId,
      },
    });

    if (!chatExists) {
      console.log("Product does not exist in the chat table");
      // Handle the case when the product does not exist
      // Create the message in the database
      chat = await prisma.chat.create({
        data: {
          userId: userId, // Assuming userId is available in the request body
          productId: productId, // Assuming productId is available in the request body
        },
      });
    } else {
      console.log("Product exists in the chat table");
      // Handle the case when the product exists
      chat = chatExists;
    }

    // Return a success response with the created message data
    console.log("=================chatId===================");
    console.log(chat);
    console.log("====================================");
    return new Response(JSON.stringify({ chat, status: 201 }));
  } catch (error) {
    console.error("Error creating message:", error);
    // Return a JSON response with an error message and status 500

    return new Response(JSON.stringify({ useId, status: 500 }));
  }
}
