"use client";
import React, { useState } from "react";

const ProductForm = () => {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");

	const handleTitleChange = (e) => {
		setTitle(e.target.value);
	};

	const handleCategoryChange = (e) => {
		setCategory(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Handle form submission logic here
		try {
			const res = await fetch("/api/product/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json", // Specify JSON content type
				},
				body: JSON.stringify({
					title: title,
					category: category,
					ownerId: "5745a5dd-1d1e-468c-82e8-3cbcf98ec084",
					chatId: "a8326c4b-b607-4b26-b20d-96c1dea638a2",
					userId: "83ff34fe-7d3d-4498-8b5a-0566f2bb528b",
				}),
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			const message = await res.json();

			// Assuming the response from the server is an object with 'text' property
			setMessages([message.text, ...messages]);
			setInputValue("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<div>
			<h1 className="mt-5">Add Product</h1>
			<form
				className="border-2 border-red-500 max-w-96 mt-2 pt-5 pb-5 flex flex-col items-center"
				onSubmit={handleSubmit}>
				<label>Title:</label>
				<input
					className=" text-black"
					type="text"
					value={title}
					onChange={handleTitleChange}
				/>
				<br />
				<label>Category:</label>
				<input
					className=" text-black"
					type="text"
					value={category}
					onChange={handleCategoryChange}
				/>

				<br />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default ProductForm;
