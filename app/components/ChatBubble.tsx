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
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden"
        style={{
          background: "var(--ds-gray-200)",
          boxShadow: "0 0 0 1px var(--ds-gray-400)",
        }}
      >
        {avatarSrc ? (
          <Image
            className="w-full h-full object-cover"
            alt={avatarAlt}
            src={avatarSrc}
            width={28}
            height={28}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--ds-gray-900)" }}
          >
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ color: "var(--ds-background-100)" }}
            >
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
            isSender ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
          style={
            isSender
              ? {
                  background: "var(--ds-gray-900)",
                  color: "var(--ds-background-100)",
                }
              : {
                  background: "var(--ds-gray-200)",
                  color: "var(--ds-gray-900)",
                }
          }
        >
          {message}
        </div>
        <time
          className="text-[10px] px-1"
          style={{ color: "var(--ds-gray-600)" }}
        >
          {formattedTime}
        </time>
      </div>
    </div>
  );
};

export default ChatBubble;
