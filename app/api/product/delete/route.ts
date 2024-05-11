import prisma from "../../../util/prismaClient";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: any) {
  const { id: productId } = await req.json();

  try {
    await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
      // Delete all associated Message records
      await prisma.message.deleteMany({
        where: {
          chatId: {
            in: (
              await prisma.chat.findMany({
                where: { productId },
                select: { id: true },
              })
            ).map((chat) => chat.id),
          },
        },
      });

      // Delete all associated Chat records
      await prisma.chat.deleteMany({ where: { productId } });

      // Finally, delete the Product record
      await prisma.product.delete({ where: { id: productId } });
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error("Error deleting product:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
