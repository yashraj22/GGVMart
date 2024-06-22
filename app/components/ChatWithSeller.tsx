"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "@/app/context/AuthContext";
import { navigate } from "../util/redirect";
import supabase from "../util/supabaseClient";

const ChatWithSeller = ({ productId, receiverId, onAuthRequired }: any) => {
  const [userId, setUserId] = useState();
  const { user }: any = useUserAuth();

  useEffect(() => {
    const getIdFetch = async () => {
      const { data } = await supabase.auth.getSession();
      const id: any = data.session?.user.id;
      if (id) {
        setUserId(id);
      }
    };
    getIdFetch();
  }, []);

  const handleChatWithSeller = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    console.log("====================================");
    console.log("hello");
    console.log("====================================");

    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        navigate(`chats/${data?.chat.id}/${receiverId}`);

        console.log("================chat id====================");
        console.log(data?.chat as any);
        console.log("====================================");
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  if (userId === receiverId) {
    return null;
  }

  return (
    <div>
      <button
        className={
          `border text-white font-bold border-gray-300 rounded-sm px-4 py-1` +
          (userId === receiverId
            ? " cursor-not-allowed  bg-transparent "
            : " bg-gray-800  hover:bg-gray-700")
        }
        onClick={handleChatWithSeller}
        disabled={userId === receiverId}
        aria-disabled={userId === receiverId}
      >
        Chat
      </button>
    </div>
  );
};

export default ChatWithSeller;
