import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request,response) {

    try {
		const { userId, productId } = await request.json()
	

		console.log(data);

		// Create the message in the database
		const chat = await prisma.chat.create({
            data: {
                userId: userId, // Assuming userId is available in the request body
                productId: productId, // Assuming productId is available in the request body
            },
        });

		// Return a success response with the created message data
		return NextResponse.json({ chat }, { status: 201 });
	} catch (error) {
		console.error("Error creating message:", error);
		// Return a JSON response with an error message and status 500
		return NextResponse.json(
			{ userId },
			{ status: 500 },
		);
	}




   

}


