"use client";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/app/components/ChatBubble";
import { useUserAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fetchUserDetail } from "@/app/util/actions";

export default function Page({ params }: { params: { slug: string } }) {
  const [newMessage, setNewMessage] = useState("");
  const { user }: any = useUserAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setuserData] = useState<any>();

  const ownerId = params.slug[1];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const response = await fetch("/api/msg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatId: params.slug[0] }),
          });
          const data = await response.json();
          if (response.ok) {
            setMessages(data.messages);
          } else {
            console.error("Failed to fetch messages:", data.error);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, messages]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    if (ownerId) {
      fetchUserDetail(ownerId).then((data) => {
        setuserData(data);
      });
    }
  }, [ownerId]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isScrolledToBottom =
        Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
      setAutoScroll(isScrolledToBottom);
    }
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (newMessage.trim() === "") return; // Skip empty messages

    try {
      const res = await fetch("/api/messages/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage,
          chatId: params.slug[0],
          senderId: user?.id,
          receiverId: ownerId,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, senderId: user?.id },
      ]);
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

  return (
    <div className="flex flex-col items-center h-[calc(100vh-5rem)]">
      {/* Outermost parent container with fixed height */}
      <div className="flex flex-col w-full h-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage
                alt="User"
                src={userData && userData.user.raw_user_meta_data.picture}
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <h2 className="text-lg font-bold">
                {userData && userData.user.raw_user_meta_data.name}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selling: Retro Bluetooth Speaker
              </p>
            </div>
          </div>
        </div>
        {/* Scrollable chat messages container */}
        <div
          className="flex-1 p-4 gap-4 overflow-y-auto relative"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {messages.map((message: any) => {
            const isSender = message.senderId === user.id;
            return (
              <ChatBubble
                key={message.id}
                isSender={isSender}
                avatarSrc={isSender ? user?.user_metadata?.picture : undefined}
                avatarAlt="User"
                initials="JD"
                message={message.text}
                time={new Date().toLocaleString()}
              />
            );
          })}
        </div>
        {/* Footer */}
        <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="max-h-[100px] w-full min-h-[40px] resize-none"
            placeholder="Type a message..."
            onKeyDown={handleKeyDown}
          />
          <Button className="ml-4" onClick={(e) => handleSendMessage(e)}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
