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
  const { toast } = useToast();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
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
    <div>
      <h1 className="mt-5">Add Product</h1>
      <form
        className="border-2 border-red-500 max-w-96 mt-2 pt-5 pb-5 flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Title:</label>
        <input
          className="text-black"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <br />
        <label htmlFor="category">Category:</label>
        <input
          className="text-black"
          type="text"
          value={category}
          onChange={handleCategoryChange}
          required
        />
        <label htmlFor="images">Upload Images:</label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef} // Reference to the file input element
          multiple
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProductForm;
