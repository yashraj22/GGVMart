import prisma from "../../../util/prismaClient";

export async function POST(req: Request) {
  try {
    const { title, category, price, description, ownerId } = await req.json();

    // Create the message in the database
    const product = await prisma.product.create({
      data: {
        title: title, // Replace with your actual product title
        category: category, // Replace with your actual product category
        price: price, // Replace with your actual product price
        description: description,
        owner: {
          connect: {
            id: ownerId, // Replace with the actual owner id
          },
        },
      },
    } as any);

    return new Response(JSON.stringify({ product: product }), { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);

    return new Response(JSON.stringify({ error }));
  }
}
