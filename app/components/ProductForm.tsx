"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { HiSparkles } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { user }: any = useUserAuth();
  const [messages, setMessages] = useState<string[]>([]);
  const { supabase }: any = useUserAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: File[] = Array.from(event.target.files || []);
    setImageFiles(fileList);
  };

  const handleUpload = async (id: string, pid: string, imageFiles: File[]) => {
    try {
      const uploads = imageFiles.map(async (file) => {
        // Generate a unique name for the image
        const imageName = `${id}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(`${id}/${pid}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Construct the public URL
        const prefix =
          "https://fcxinicurznowjkhcuvd.supabase.co/storage/v1/object/public/images/";
        const imageUrl = `${prefix}/${id}/${pid}/${file.name}`;

        return imageUrl;
      });

      // Wait for all uploads to finish
      const uploadedImages = await Promise.all(uploads);
      setImageUrls(uploadedImages);

      // Return the image URLs for further processing
      return uploadedImages;
    } catch (error: any) {
      console.error("Error uploading images:", error.message);
      return [];
    }
  };

  const fixDescription = async () => {
    try {
      const res = await fetch("/api/fixText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }), // Ensure text is passed as JSON
      });

      if (!res.ok) throw new Error("Failed to fetch generated text");

      const data = await res.json();
      console.log(data.candidates[0].content.parts[0].text); // Log the specific part of the response data

      // Set the text input to the enhanced sentence from the response
      setDescription(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error fetching generated text:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure images are uploaded first
    if (imageFiles.length === 0) {
      console.error("No image files selected.");
      return;
    }

    // This will check that user put some valid amount in the price field. okay buddy.
    if (isNaN(Number(price))) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        className: "bg-red-500",
      });

      return;
    }

    try {
      // Create the product first to get the product ID
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          price,
          description,
          ownerId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();

      setTitle("");
      setCategory("");
      setImageFiles([]);
      setImageUrls([]);
      setDescription("");
      setPrice("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Product Added",
        description: "Your product has been successfully added.",
        className: "bg-green-500",
      });

      const productId = message.product.id;

      // Upload images associated with the new product
      const uploadedImageUrls = await handleUpload(
        user.id,
        productId,
        imageFiles,
      );

      // Ensure there are valid uploaded image URLs
      if (uploadedImageUrls.length === 0) {
        console.error("No images were uploaded successfully.");
        return;
      }

      // Update the product with the uploaded images
      const updateRes = await fetch("/api/product/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
          images: uploadedImageUrls,
        }),
      });

      router.push("/");

      if (!updateRes.ok) {
        throw new Error(updateRes.statusText);
      }

      const updateMessage = await updateRes.json();
      setMessages([updateMessage.text, ...messages]);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-gray-600 mb-2"
          >
            Title:
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-2  border-b-2 border-dotted  border-gray-300 text-gray-800 focus:outline-none "
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {/* Description: */}

        <div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-600 mb-2"
            >
              Description:
            </label>

            <div className="flex border-b-2 border-dotted border-gray-300 ">
              <input
                id="description"
                type="text"
                className="w-full px-2 py-2 outline-none  rounded-md text-gray-800 focus:outline-none "
                value={description}
                onChange={handleDescriptionChange}
                required
              />

              <button type="button" onClick={fixDescription}>
                <HiSparkles className="mr-5 text-xl text-[#608ee4]" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="text-sm font-semibold text-gray-600 mb-2"
          >
            Category:
          </label>
          <select
            id="category"
            className="w-full  py-3 border-b-2 border-dotted border-gray-300  text-gray-800 focus:outline-none "
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option className="py-3" value="">
              Select Category of product
            </option>
            <option value="Smartphones">Smartphones</option>
            <option value="Households">Household</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationary">Stationary</option>
            <option value="Others">Other</option>
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label
            htmlFor="price"
            className="text-sm font-semibold text-gray-600 mb-2"
          >
            Price:
          </label>
          <input
            id="price"
            type="text"
            className="w-full px-2 py-2 border-b-2 border-dotted border-gray-300  text-gray-800 focus:outline-none "
            value={price}
            onChange={handlePriceChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="images"
            className="text-sm font-semibold text-gray-600 mb-2"
          >
            Upload Images:
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            className="w-full  py-2 mb-5 rounded-md focus:outline-none"
            onChange={handleFileChange}
            ref={fileInputRef}
            multiple
            required
          />
        </div>
        <button
          type="submit"
          className="w-1/2 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
