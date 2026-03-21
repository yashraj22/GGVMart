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
  // Format time more concisely
  const formattedTime = (() => {
    try {
      const d = new Date(time);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return time;
    }
  })();

  return (
    <div
      className={`flex items-end gap-2 ${
        isSender ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden bg-[#f2f2f2] ring-1 ring-[#e2e2e2]">
        {avatarSrc ? (
          <Image
            className="w-full h-full object-cover"
            alt={avatarAlt}
            src={avatarSrc}
            width={28}
            height={28}
          />
        ) : (
          <div className="w-full h-full bg-[#171717] flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold uppercase">
              {initials?.[0] || "?"}
            </span>
          </div>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${isSender ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
            isSender
              ? "bg-[#171717] text-white rounded-br-sm"
              : "bg-[#f2f2f2] text-[#171717] rounded-bl-sm"
          }`}
        >
          {message}
        </div>
        <time className="text-[10px] text-[#a8a8a8] px-1">{formattedTime}</time>
      </div>
    </div>
  );
};

export default ChatBubble;
