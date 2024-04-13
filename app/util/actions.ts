"use server";
// import { createClient } from "@supabase/supabase-js";
import { useUserAuth } from "../context/AuthContext";
import { redirect } from "next/navigation";

export async function navigate(data: string) {
  redirect(`${data}`);
}

export async function createBucket(folderPath: string) {
  const { supabase } = useUserAuth();
  try {
    // Use the JS library to create a bucket.

    const { data, error } = await supabase.storage.createBucket("avatars", {
      public: true,
      allowedMimeTypes: ["image/*"],
      fileSizeLimit: "1MB",
    });

    if (error) {
      console.error("Error creating folder:", error);
    } else {
      console.log("Folder created successfully:", data);
    }
  } catch (err) {
    console.error("Error creating folder:", err);
  }
}
