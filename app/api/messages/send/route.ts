import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { text, chatId, senderId, receiverId }: any = await req.json();

    // Create the message in the database
    const message = await prisma.message.create({
      data: {
        text, // Use the text from the request
        createdAt: new Date(), // Use the parsed date
        sender: {
          connect: {
            id: senderId as string,
          },
        },
        receiver: {
          connect: {
            id: receiverId as string,
          },
        },
        chat: {
          connectOrCreate: {
            create: {
              id: chatId as any,
              user: {
                connect: {
                  id: "5745a5dd-1d1e-468c-82e8-3cbcf98ec084",
                } as any,
              },
              product: {
                // Add your product details here
              },
            },
            where: {
              id: chatId,
            },
          },
        },
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