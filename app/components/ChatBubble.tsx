"use client";
import React from "react";
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
  avatarSrc?: string;
  avatarAlt: string;
  initials: string;
  message: string;
  time: string;
}) => {
  return (
    <div
      className={`flex items-end space-x-4 mb-4 ${
        isSender ? "justify-start flex-row-reverse" : ""
      }`}
    >
      <div className={`w-8 h-8 ${isSender ? "ml-4" : "mr-2"}`}>
        {avatarSrc ? (
          <Image
            className="rounded-full"
            alt={avatarAlt}
            src={avatarSrc}
            width={100}
            height={100}
          />
        ) : (
          <div className="bg-gray-300 flex items-center justify-center w-full h-full rounded-full">
            <span className="text-sm font-bold">{initials}</span>
          </div>
        )}
      </div>

      <div
        className={`rounded-lg p-4 max-w-xs ${
          isSender
            ? "bg-blue-100 dark:bg-blue-800"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
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
