// src/components/pages/MessagesPage.tsx
import React, { useEffect, useRef, useState } from "react";
import socketService, { connectSocket, emitTyping } from "../../services/socket";
import { getConversation, sendMessageREST, markMessageRead } from "../../services/api";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { PresenceDot } from "../chat/PresenceDot";
import { TypingDots } from "../chat/TypingDots";
import { ChatBubble } from "../chat/ChatBubble";

type Message = {
  _id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp?: string;
  delivered?: boolean;
  read?: boolean;
};

type MessagesPageProps = {
  conversationPartnerId: string;
  currentUserId: string;
};

export function MessagesPage({ conversationPartnerId, currentUserId }: MessagesPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  // Load conversation on mount
  useEffect(() => {
    (async () => {
      const data = await getConversation(conversationPartnerId);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    })();
  }, [conversationPartnerId]);

  // Setup socket listeners
  useEffect(() => {
    connectSocket();

    const offOnline = socketService.onPresence((p: any) => {
      if (String(p.userId) === String(conversationPartnerId)) setPartnerOnline(true);
    });

    const offOffline = socketService.onPresenceOff((p: any) => {
      if (String(p.userId) === String(conversationPartnerId)) setPartnerOnline(false);
    });

    const offReceive = socketService.onReceiveMessage((msg: Message) => {
      if (
        (msg.sender_id === conversationPartnerId && msg.receiver_id === currentUserId) ||
        (msg.sender_id === currentUserId && msg.receiver_id === conversationPartnerId)
      ) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }
    });

    const offDelivered = socketService.onDelivered((payload: any) => {
      const { messageId } = payload;
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, delivered: true } : m))
      );
    });

    const offRead = socketService.onRead((payload: any) => {
      const { messageId } = payload;
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, read: true } : m))
      );
    });

    const offTyping = socketService.onTyping((payload: any) => {
      if (payload.from === conversationPartnerId) {
        setPartnerTyping(payload.isTyping);
      }
    });

    return () => {
      offOnline();
      offOffline();
      offReceive();
      offDelivered();
      offRead();
      offTyping();
    };
  }, [conversationPartnerId, currentUserId]);

  // Mark unread messages as read
  useEffect(() => {
    const unread = messages.filter(
      (m) => !m.read && m.receiver_id === currentUserId && m._id
    );
    unread.forEach((msg) => {
      socketService.emit("messageRead", { messageId: msg._id });
      markMessageRead(msg._id!);
    });
  }, [messages, currentUserId]);

  // Handle send
  async function handleSend() {
    if (!text.trim()) return;

    const optimistic: Message = {
      sender_id: currentUserId,
      receiver_id: conversationPartnerId,
      content: text,
      timestamp: new Date().toISOString(),
      delivered: false,
      read: false,
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    scrollToBottom();

    socketService.emit("sendMessage", optimistic);
  }

  // Emit typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      emitTyping(conversationPartnerId, text.length > 0);
    }, 120);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">

        {/* Chat header */}
        <div className="flex items-center gap-3 mb-4 border-b pb-3">
          <PresenceDot online={partnerOnline} />
          <div>
            <h2 className="font-semibold">Chat</h2>
            <div className="text-sm text-muted-foreground">
              {partnerOnline ? "Online" : "Offline"}
            </div>
            {partnerTyping && <TypingDots />}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="h-[70vh] overflow-y-auto space-y-3 p-3 bg-card rounded-xl shadow-inner"
        >
          {messages.map((m, idx) => {
            const isMe = m.sender_id === currentUserId;
            return (
              <ChatBubble
                key={m._id || idx}
                isMe={isMe}
                content={m.content}
                timestamp={m.timestamp || ""}
                delivered={m.delivered}
                read={m.read}
              />
            );
          })}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-3 mt-4">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
