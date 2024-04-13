import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { title } from "process";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: title, // TODO : Image
      },
    });
  } catch (err) {}
}
