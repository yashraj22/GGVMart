import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId }: { userId: UUID } = await req.json();
  try {
    const userChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true, // Include the user details for each chat
        product: true, // Include the product details for each chat
        messages: true, // Include the messages for each chat
      },
    });
    // return userChats;
    return Response.json({ userChats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json({ error });
  }
}
