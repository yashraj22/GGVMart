import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
	try {
		const data = await req.json();
		const { title, category, ownerId } = data;

		// Create the message in the database
		const product = await prisma.product.create({
			data: {
				title: title, // Replace with your actual product title
				category: category, // Replace with your actual product category
				owner: {
					connect: {
						id: ownerId, // Replace with the actual owner id
					},
				},
			},
		});

		// Return a success response with the created message data
		return NextResponse.json({ product }, { status: 201 });
	} catch (error) {
		console.error("Error creating message:", error);
		// Return a JSON response with an error message and status 500
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
