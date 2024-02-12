import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req) {
	const products = await prisma.product.findMany();
	console.log(products);
	return Response.json({ products });

}


