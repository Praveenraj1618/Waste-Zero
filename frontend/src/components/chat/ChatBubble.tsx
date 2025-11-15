// src/components/chat/ChatBubble.tsx
import React from "react";
import { MessageStatus } from "./MessageStatus";

export function ChatBubble({
  isMe,
  content,
  timestamp,
  delivered,
  read,
}: {
  isMe: boolean;
  content: string;
  timestamp: string;
  delivered?: boolean;
  read?: boolean;
}) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm 
        ${isMe ? "bg-primary text-white" : "bg-muted text-foreground"}`}
      >
        <div className="text-sm">{content}</div>
        <div className="flex justify-end items-center gap-2 mt-1 text-xs opacity-80">
          <span>{new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isMe && <MessageStatus delivered={delivered} read={read} />}
        </div>
      </div>
    </div>
  );
}
