"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure images are uploaded first
    if (imageFiles.length === 0) {
      console.error("No image files selected.");
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="text-sm font-semibold text-gray-600 mb-2"
          >
            Category:
          </label>
          <input
            id="category"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={handleCategoryChange}
            required
          />
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFileChange}
            ref={fileInputRef}
            multiple
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
