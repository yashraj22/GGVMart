import prisma from "../../util/prismaClient";

export async function POST(req: Request) {
  const { chatId, senderId }: any = await req.json();
  try {
    // Fetch messages for the specified chatId
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
        senderId: senderId,
      },
      // Include any additional fields or relations if needed
    });

    return Response.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Return an error response
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
