import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
	try {
		const data = await req.json();
		const { text, chatId } = data;

		// Create the message in the database
		const message = await prisma.message.create({
			data: {
				text, // Use the text from the request
				createdAt: new Date(), // Use the parsed date
				chat: {
					connectOrCreate: {
						create: {
							id: chatId,
							user: {
								connect: {
									id: "5745a5dd-1d1e-468c-82e8-3cbcf98ec084",
								},
							},
						},
						where: {
							id: chatId,
						},
					},
				},
			},
		});

		// Return a success response with the created message data
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
