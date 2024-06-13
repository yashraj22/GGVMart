import prisma from "../../util/prismaClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productdata } = await req.json();
  try {
    for (const product of productdata) {
      const userChats = await prisma.chat.findMany({
        where: {
          productId: product.id,
        },
      });
      if (userChats.length > 0) {
        return NextResponse.json({ userChats });
      }
    }
    return NextResponse.json({ message: "No chats found for this product." });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error });
  }
}
