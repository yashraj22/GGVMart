import prisma from "../../../util/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  props: { params: Promise<{ productId: string }> },
) {
  const params = await props.params;
  const productId: string = params.productId;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        productId: productId,
      },
    });
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error });
  }
}
