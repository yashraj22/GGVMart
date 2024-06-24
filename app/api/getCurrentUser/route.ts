import prisma from "../../util/prismaClient";
import { NextResponse } from "next/server";

export async function GET(req: any, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const userChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      select: {
        productId: true,
      },
    });

    console.log("Fetched user chats:", userChats); // Log the fetched data

    return NextResponse.json({ userChats });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user chats" },
      { status: 500 },
    );
  }
}
