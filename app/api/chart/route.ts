import prisma from "../../util/prismaClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "userId and productId are required" },
        { status: 400 },
      );
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        productId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat }, { status: 200 });
    }

    const chat = await prisma.chat.create({
      data: {
        userId,
        productId,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}
