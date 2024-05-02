"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";

const ProductForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { user }: any = useUserAuth();
  const [messages, setMessages] = useState<any>([]);
  const { supabase }: any = useUserAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handleFileChange = (event: any) => {
    const fileList: File[] = Array.from(event.target.files);
    console.log(fileList);
    setImageFiles(fileList);
  };

  const handleUpload = async (id: string, pid: string, imageFiles: File[]) => {
    try {
      const uploads = imageFiles.map(async (file) => {
        // Generate a unique name for the image
        const imageName = `${id}-${file.name}`;
        console.log(imageName);

        const { data, error } = await supabase.storage
          .from("images")
          .upload(id + "/" + pid + "/" + file.name, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        //
        const prefix =
          "https://fcxinicurznowjkhcuvd.supabase.co/storage/v1/object/public/images/";
        const imageUrl = prefix + "/" + id + "/" + pid + "/" + file.name;

        setImageUrls((prevUrls) => [...prevUrls, imageUrl]);

        return imageUrl;
      });

      // Wait for all uploads to finish
      const uploadedImages = await Promise.all(uploads);
      setImageUrls(uploadedImages);
      // Log the URLs of the uploaded images
      console.log("Image URLs:", imageUrls);
      addImages(pid);
    } catch (error: any) {
      console.error("Error uploading images:", error.message);
    }
  };
  const addImages = async (id: string) => {
    // Handle form submission logic here
    try {
      const res = await fetch("/api/product/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          id: id,
          images: imageUrls,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();
      console.log(message);
      // Assuming the response from the server is an object with 'text' property
      setMessages([message.text, ...messages]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleSubmit = async (e: any) => {
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
          ownerId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();
      console.log(message);
      // Assuming the response from the server is an object with 'text' property
      setMessages([message.text, ...messages]);

      handleUpload(user.id, message.product.id, imageFiles);
    } catch (error) {
      console.error("Error sending message:", error);
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
          className=" text-black"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <br />
        <label htmlFor="category">Category:</label>
        <input
          className=" text-black"
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
