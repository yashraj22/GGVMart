import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { text, chatId, senderId, receiverId }: any = await req.json();

    // Create the message in the database
    const message = await prisma.message.create({
      data: {
        text: text,
        chatId: chatId as string,
        senderId: "1e9994b6-e424-4f15-931e-e7ad9aaec851", // Replace with the appropriate sender ID
        receiverId: "83ff34fe-7d3d-4498-8b5a-0566f2bb528b",
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
