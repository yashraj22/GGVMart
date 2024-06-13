import prisma from "../../util/prismaClient";

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId }: { userId: string } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // return userChats;
    return Response.json({ user });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json({ error });
  }
}
