"use client";
import React from "react";
import { useUserAuth } from "@/app/context/AuthContext";
import { navigate } from "../util/actions";

const ChatWithSeller = ({ productId, receiverId }: any) => {
  const { user }: any = useUserAuth();

  const handleChatWithSeller = async () => {
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
          userId: user.id, // Replace with the actual user ID
          productId: productId, // Replacep with the actual product ID
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        navigate(`chats/${data?.chat.id}/${receiverId}`);

        console.log("================chat id====================");
        console.log(data?.chat as any);
        console.log("====================================");
      } else {
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <div>
      <button
        className="border text-white font-bold border-gray-300 rounded-sm px-4 py-1 bg-gray-800 hover:bg-gray-700"
        onClick={handleChatWithSeller}
      >
        Chat
      </button>
    </div>
  );
};

export default ChatWithSeller;
