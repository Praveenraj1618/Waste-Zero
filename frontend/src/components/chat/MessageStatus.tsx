// src/components/chat/MessageStatus.tsx
import React from "react";

export function MessageStatus({
  delivered,
  read,
}: {
  delivered?: boolean;
  read?: boolean;
}) {
  if (read) return <span className="text-blue-500 text-xs">✓✓</span>;
  if (delivered) return <span className="text-gray-400 text-xs">✓</span>;
  return <span className="text-gray-400 text-xs opacity-50">•</span>; // sending
}
