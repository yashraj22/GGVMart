"use client";
import { useUserAuth } from "@/app/context/AuthContext";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
export default function Page({ params }: { params: { slug: string } }) {
  const [newMessage, setNewMessage] = useState("");
  const { user, loginWithGoogle, logOut }: any = useUserAuth();
  // if(user){
  //   console.log('===============user auth =====================');
  //   console.log(user);
  //   console.log('====================================');
  // }

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
        <div className="flex-1 flex flex-col justify-end p-4 gap-4 overflow-hidden">
          <div className="flex items-start space-x-4">
            <Avatar className="w-8 h-8 order-2">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
              <p className="text-sm">
                Hi, I m interested in the speaker. Could you tell me more about
                its condition?
              </p>
              <time className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="sr-only">Sent at</span>
                4:23 PM{"\n                      "}
              </time>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar className="w-8 h-8 order-2">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
              <p className="text-sm">
                The speaker is in excellent condition. It has been gently used
                and sounds amazing. Let me know if you have any other questions!
              </p>
              <time className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="sr-only">Sent at</span>
                4:25 PM{"\n                      "}
              </time>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar className="w-8 h-8">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
              <p className="text-sm">
                Thanks for the info! I m really interested in the speaker. Could
                you provide some more pictures?
              </p>
              <time className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="sr-only">Sent at</span>
                4:28 PM{"\n                      "}
              </time>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar className="w-8 h-8">
              <AvatarImage alt="User" src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
              <div className="grid gap-1.5 mt-2.5 sm:grid-cols-2"></div>
              <time className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="sr-only">Sent at</span>
                4:30 PM{"\n                      "}
              </time>
            </div>
          </div>
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
