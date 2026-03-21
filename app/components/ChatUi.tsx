"use client";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/app/components/ChatBubble";
import { useUserAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SheetSide, { ProductSideSheet } from "@/app/components/ProductSideSheet";
import { fetchUserDetail } from "../util/actions";
import { Send } from "lucide-react";

export default function ChatUi({
  params,
}: {
  params: { slug: Array<string> };
}) {
  const [newMessage, setNewMessage] = useState("");
  const { user }: any = useUserAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setuserData] = useState<any>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const ownerId = params.slug[1];
  const userId = params.slug[2] ? params.slug[2] : params.slug[1];

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const response = await fetch("/api/msg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chatId: params.slug[0],
              ...(params.slug[2] && { senderId: params.slug[2] }),
              ...(params.slug[1] && { receiverId: params.slug[1] }),
            }),
          });
          const data = await response.json();
          if (response.ok) setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user, params.slug, messages]);

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
      const message = await res.json();
      setMessages((prev) => [...prev, { ...message, senderId: user?.id }]);
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
    <div
      className="flex flex-col min-w-full"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="flex flex-col h-full min-w-full border-l border-[#e2e2e2] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f2f2f2] flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 ring-1 ring-[#e2e2e2]">
              <AvatarImage
                alt={recipientName || "User"}
                src={recipientPicture}
              />
              <AvatarFallback className="bg-[#f2f2f2] text-[#6f6f6f] text-xs font-medium">
                {recipientName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-[#171717]">
                {recipientName || "Seller"}
              </p>
              <p className="text-xs text-[#8f8f8f] mt-0.5">Online</p>
            </div>
          </div>
          <ProductSideSheet />
        </div>

        {/* Messages */}
        <div
          className="flex-1 px-4 py-4 space-y-3 overflow-y-auto"
          ref={scrollRef}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-[#e2e2e2] border-t-[#171717] rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-sm font-medium text-[#171717]">
                No messages yet
              </p>
              <p className="text-xs text-[#8f8f8f]">
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
                  time={new Date(message.createdAt).toUTCString()}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end gap-3 px-4 py-3 border-t border-[#f2f2f2] flex-shrink-0">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none px-3 py-2.5 bg-[#fafafa] border border-[#e2e2e2] rounded-lg text-sm text-[#171717] placeholder:text-[#a8a8a8] focus:outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10 transition-all max-h-[100px] overflow-y-auto"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="flex-shrink-0 w-9 h-9 bg-[#171717] text-white rounded-lg flex items-center justify-center hover:bg-[#383838] active:bg-[#171717] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
