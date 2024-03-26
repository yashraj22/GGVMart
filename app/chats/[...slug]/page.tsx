"use client";
import ChatBubble from "@/app/components/ChatBubble";
import { useUserAuth } from "@/app/context/AuthContext";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
export default function Page({ params }: { params: { slug: string } }) {
  const [newMessage, setNewMessage] = useState("");
  const { user, loginWithGoogle, logOut }: any = useUserAuth();
  // if(user){
  //   console.log('===============user auth =====================');
  //   console.log(user);
  //   console.log('====================================');
  // }
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (user) {
          const response = await fetch("/api/msg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatId: params.slug[0] }), // Replace "YOUR_CHAT_ID" with the actual chatId
          });
          const data = await response.json();
          if (response.ok) {
            setMessages(data.messages);
            console.log("=================data.messages===================");
            console.log(data.messages);
            console.log("====================================");
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
  }, [user]);

  const handleSendMessage = async (e: any) => {
    console.log("====================================");
    console.log("msg send ho rha hai");
    console.log("====================================");
    e.preventDefault();
    try {
      const res = await fetch("/api/messages/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          text: newMessage,
          chatId: params.slug[0],
          senderId: user?.id as string,
          receiverId: params.slug[1] as string,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();
      console.log("Message created:", message);

      // Assuming the response from the server is an object with 'text' property
      //   setMessages([message.text, ...messages]);
      //   console.log("Messages:", messages);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };
  return (
    <>
      chatId: {params.slug[0]} Owner id {params.slug[1]}
      <div className="flex flex-col h-[600px] rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <h2 className="text-lg font-bold">Alice</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Selling: Retro Bluetooth Speaker
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Contact support
          </Button>
        </div>
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {messages &&
            messages.map((message: any) => (
              <ChatBubble
                key={message.id}
                isSender={true}
                avatarSrc="/placeholder-user.jpg"
                avatarAlt="User"
                initials="JD"
                message={message.text}
                time="4:23 PM"
              />
            ))}
        </div>
        <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="max-h-[100px] w-full min-h-[40px] resize-none"
            placeholder="Type a message..."
          />
          <Button
            className="ml-4"
            onClick={(e) => handleSendMessage(e)}
            onKeyDown={(e) => handleKeyDown(e)}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
