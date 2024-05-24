import prisma from "../../util/prismaClient";

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { productId } = await req.json();
  try {
    const userChats = await prisma.chat.findMany({
      where: {
        productId: productId,
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
