import React, { useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@/app/context/AuthContext";

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const { supabase }: any = useUserAuth();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  if (!selectedFile) {
    console.error("No file selected");
    return;
  }

  // const formData = new FormData();
  // formData.append("file", selectedFile);
  // try {
  //   const response = await fetch("YOUR_API_URL", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }
  //   const data = await response.json();
  //   console.log(data);
  // } catch (error) {
  //   console.error("Error:", error);
  // }

  return (
    <div>
      <h2>Upload Image</h2>
    </div>
  );
};

export default ImageUpload;
