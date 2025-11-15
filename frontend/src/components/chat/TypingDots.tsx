// src/components/chat/TypingDots.tsx
import React from "react";

export function TypingDots() {
  return (
    <div className="flex space-x-1 items-center">
      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      <span
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="w-2 h-2 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
