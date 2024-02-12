// pages/api/product/[id].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
	const { id } = req.query;

	const product = await prisma.product.findUnique({
		where: { id },
	});

	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}

	const ownerId = product.ownerId;

	res.json({ ownerId });
}
