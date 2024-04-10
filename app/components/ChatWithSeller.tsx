"use client";
import React from "react";
import { useUserAuth } from "@/app/context/AuthContext";
import { navigate } from "../actions";

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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleChatWithSeller}
      >
        {/* {receiverId} */}
        Chat With Seller
      </button>
    </div>
  );
};

export default ChatWithSeller;
