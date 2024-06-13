import prisma from "../../util/prismaClient";

export async function POST(req: Request) {
  const { chatId, senderId, recieverId }: any = await req.json();
  try {
    // Fetch messages for the specified chatId
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            chatId: chatId,
            ...(senderId && { senderId: senderId }),
          },
          {
            chatId: chatId,
            ...(recieverId && { recieverId: recieverId }),
          },
        ],
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
