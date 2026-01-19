// src/components/chat/PresenceDot.tsx
import React from "react";

export function PresenceDot({ online }: { online: boolean }) {
  return (
    <span
      className={`inline-block w-3 h-3 rounded-full border 
      ${online ? "bg-green-500 border-green-600" : "bg-gray-400 border-gray-500"}`}
    />
  );
}
