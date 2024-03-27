import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
const ChatBubble = ({
  isSender,
  avatarSrc,
  avatarAlt,
  initials,
  message,
  time,
}: {
  isSender: boolean;
  avatarSrc: string;
  avatarAlt: string;
  initials: string;
  message: string;
  time: string;
}) => {
  return (
    <div
      className={`flex items-start space-x-4 ${isSender ? "justify-end" : ""}`}
    >
      {/* <Avatar className={`w-8 h-8 ${isSender ? "order-2" : ""}`}>
        <AvatarImage alt={avatarAlt} src={avatarSrc} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar> */}
      <div className={`w-8 h-8 ${isSender ? "order-2" : ""}`}>
        <Image alt={avatarAlt} src={avatarSrc} width={100} height={100} />
      </div>
      <div className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800">
        <p className="text-sm">{message}</p>
        <time className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="sr-only">Sent at</span>
          {time}
        </time>
      </div>
    </div>
  );
};

export default ChatBubble;
