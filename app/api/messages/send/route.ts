import prisma from "../../../util/prismaClient";
import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { text, chatId, senderId, receiverId }: any = await req.json();

    // Create the message in the database
    const message = await prisma.message.create({
      data: {
        text: text,
        chatId: chatId as string,
        senderId: senderId,
        receiverId: receiverId,
      },
    });
    console.log("====================================");
    console.log("msg sent");
    console.log("====================================");
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    // Return a JSON response with an error message and status 500
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
