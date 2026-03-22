"use client";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/app/components/ChatBubble";
import { useUserAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductSideSheet } from "@/app/components/ProductSideSheet";
import { fetchUserDetail } from "../util/actions";
import { Send } from "lucide-react";

export default function ChatUi({
  params,
  isParentLoading = false,
  showProductSheet = false,
}: {
  params: { slug: Array<string> };
  isParentLoading?: boolean;
  showProductSheet?: boolean;
}) {
  const [newMessage, setNewMessage] = useState("");
  const { user, loading: authLoading }: any = useUserAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setuserData] = useState<any>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const ownerId = params.slug[1];
  const userId = params.slug[2] ? params.slug[2] : params.slug[1];
  const chatId = params.slug[0];

  useEffect(() => {
    if (authLoading || isParentLoading) {
      setLoading(true);
      return;
    }

    if (!user || !chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/msg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            ...(params.slug[2] && { senderId: params.slug[2] }),
            ...(params.slug[1] && { receiverId: params.slug[1] }),
          }),
        });
        const data = await response.json();
        if (response.ok) setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authLoading, chatId, isParentLoading, params.slug, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId).then((data) => {
        setuserData(data);
      });
    }
  }, [userId]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    try {
      const res = await fetch("/api/messages/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newMessage,
          chatId: params.slug[0],
          senderId: user?.id,
          receiverId: ownerId,
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const sentMessage = data.message;

      if (!sentMessage) {
        throw new Error("Invalid send message response");
      }

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const recipientName = userData?.user?.raw_user_meta_data?.name;
  const recipientPicture = userData?.user?.raw_user_meta_data?.picture;

  return (
    <div className="flex flex-col min-w-full h-full">
      <div
        className="flex flex-col h-full min-w-full overflow-hidden"
        style={{
          borderLeft: "1px solid var(--ds-gray-400)",
          background: "var(--ds-background-100)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--ds-gray-200)" }}
        >
          <div className="flex items-center gap-3">
            <Avatar
              className="w-8 h-8"
              style={{ boxShadow: "0 0 0 1px var(--ds-gray-400)" }}
            >
              <AvatarImage
                alt={recipientName || "User"}
                src={recipientPicture}
              />
              <AvatarFallback
                className="text-xs font-medium"
                style={{
                  background: "var(--ds-gray-200)",
                  color: "var(--ds-gray-800)",
                }}
              >
                {recipientName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--ds-gray-900)" }}
              >
                {recipientName || "Seller"}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--ds-gray-700)" }}
              >
                Online
              </p>
            </div>
          </div>
          {showProductSheet ? <ProductSideSheet /> : null}
        </div>

        {/* Messages */}
        <div
          className="flex-1 px-4 py-4 space-y-3 overflow-y-auto"
          ref={scrollRef}
        >
          {loading ? (
            <MessagesSkeleton />
          ) : !chatId ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--ds-gray-900)" }}
              >
                Select a conversation
              </p>
              <p className="text-xs" style={{ color: "var(--ds-gray-700)" }}>
                Your messages will appear here.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--ds-gray-900)" }}
              >
                No messages yet
              </p>
              <p className="text-xs" style={{ color: "var(--ds-gray-700)" }}>
                Say hello to start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message: any) => {
              const isSender = message.senderId === user?.id;
              return (
                <ChatBubble
                  key={message.id}
                  isSender={isSender}
                  avatarSrc={
                    isSender ? user?.user_metadata?.picture : recipientPicture
                  }
                  avatarAlt={isSender ? "You" : recipientName}
                  initials={isSender ? "Me" : recipientName?.[0] || "?"}
                  message={message.text}
                  time={message.createdAt}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-end gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--ds-gray-200)" }}
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none px-3 py-2.5 rounded-lg text-sm transition-all max-h-[100px] overflow-y-auto outline-none"
            style={{
              background: "var(--ds-gray-100)",
              border: "1px solid var(--ds-gray-400)",
              color: "var(--ds-gray-900)",
            }}
            disabled={!chatId || loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatId || loading || !newMessage.trim()}
            className="btn-primary flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ width: 36, height: 36, padding: 0 }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

const MessagesSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, index) => {
      const isSender = index % 2 === 1;
      return (
        <div
          key={index}
          className={`flex ${isSender ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`skeleton h-12 rounded-2xl ${
              isSender ? "w-40" : "w-52"
            }`}
          />
        </div>
      );
    })}
  </div>
);
