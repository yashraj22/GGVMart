import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
	try {
		const data = await req.json();
		const { text, chatId } = data;

		// Create the message in the database
		const message = await prisma.message.findMany({
			where: {
				chatId: chatId,
			},
		});
	} catch (error) {
		console.error("Error fetching messages:", error);
		// Return a JSON response with an error message and status 500
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}