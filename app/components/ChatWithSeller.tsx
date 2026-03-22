"use client";
import React, { useState } from "react";
import { useUserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";

const ChatWithSeller = ({
  productId,
  receiverId,
  onAuthRequired,
  large = false,
}: {
  productId: string;
  receiverId: string;
  onAuthRequired?: () => void;
  large?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const { user }: any = useUserAuth();
  const router = useRouter();

  const handleChatWithSeller = async () => {
    const currentUserId = user?.id;

    if (!currentUserId) {
      onAuthRequired?.();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, productId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.status}`);
      }

      const data: any = await response.json();
      router.push(`/chats/${data.chat.id}/${receiverId}`);
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.id === receiverId) return null;

  if (large) {
    return (
      <button
        id={`chat-btn-${productId}`}
        onClick={handleChatWithSeller}
        disabled={loading}
        className="w-full btn-primary disabled:opacity-50"
        style={{ height: 40, fontSize: 13.5, borderRadius: 9, gap: 7 }}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <MessageCircle size={14} strokeWidth={2} />
        )}
        {loading ? "Connecting..." : "Chat with seller"}
      </button>
    );
  }

  return (
    <button
      id={`chat-btn-${productId}`}
      onClick={handleChatWithSeller}
      disabled={loading}
      className="btn-secondary disabled:opacity-50"
      style={{
        height: 30,
        paddingInline: 10,
        fontSize: 12,
        borderRadius: 7,
        gap: 5,
      }}
    >
      {loading ? (
        <Loader2 size={11} className="animate-spin" />
      ) : (
        <MessageCircle size={11} strokeWidth={2} />
      )}
      {loading ? "..." : "Chat"}
    </button>
  );
};

export default ChatWithSeller;
