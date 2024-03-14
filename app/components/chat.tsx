// chat.js
import React, { useEffect, useState } from "react";
import { useUserAuth } from "@/app/context/AuthContext";

const ChatUi = () => {
  const [messages, setMessages] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const { user }: any = useUserAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        const messages = data.messages.map(
          (message: { text: any }) => message.text,
        );
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

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
          text: inputValue,
          chatId: "a8326c4b-b607-4b26-b20d-96c1dea638a2",
          senderId: user.id,
          receiverId: 456 as any,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const message = await res.json();
      console.log("Message created:", message);

      // Assuming the response from the server is an object with 'text' property
      setMessages([message.text, ...messages]);
      console.log("Messages:", messages);
      setInputValue("");
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
    <div>
      <h1 className="mt-5">Message</h1>
      <div className=" items-center chat-container px-4 py-11 border-neutral-50 border-2 flex flex-col w-96 mt-2 ">
        {messages && messages.length > 0 && (
          <div className="chat-messages border-2 border-neutral-200">
            {messages
              .map((message: any, index: any) => (
                <div key={message + index} className="chat-message text-white">
                  {message}
                </div>
              ))
              .reverse()}
          </div>
        )}
        <div className="chat-input mt-4">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              className="text-black text-"
              placeholder="Type your message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" className="ml-5">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
