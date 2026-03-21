"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "@/app/context/AuthContext";
import { navigate } from "../util/redirect";
import supabase from "../util/supabaseClient";
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
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { user }: any = useUserAuth();

  useEffect(() => {
    const getIdFetch = async () => {
      const { data } = await supabase.auth.getSession();
      const id: any = data.session?.user.id;
      if (id) setUserId(id);
    };
    getIdFetch();
  }, []);

  const handleChatWithSeller = async () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });
      if (response.ok) {
        const data: any = await response.json();
        navigate(`chats/${data?.chat.id}/${receiverId}`);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userId === receiverId) return null;

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
