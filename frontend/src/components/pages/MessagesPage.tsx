// src/components/pages/MessagesPage.tsx
import React, { useEffect, useRef, useState } from "react";
import socketService, { connectSocket, emitTyping } from "../../services/socket";
import { getConversation, getConversations, sendMessageREST, markMessageRead } from "../../services/api";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";

import { PresenceDot } from "../chat/PresenceDot";
import { TypingDots } from "../chat/TypingDots";
import { ChatBubble } from "../chat/ChatBubble";
import { User } from "lucide-react";

type Message = {
  _id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp?: string;
  delivered?: boolean;
  read?: boolean;
};

type Conversation = {
  partner: {
    _id: string;
    name: string;
    email: string;
  };
  lastMessage: Message;
};

type MessagesPageProps = {
  onNavigate?: (page: string) => void;
  currentUserId?: string; // Made optional to fix type error, but required for logic
};

export function MessagesPage({ onNavigate, currentUserId }: MessagesPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLDivElement>(null);

  if (!currentUserId) return <div className="p-8 text-center">Please login to view messages.</div>;

  function scrollToBottom() {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  // Load conversations list
  useEffect(() => {
    async function loadConvs() {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    }
    loadConvs();
  }, [currentUserId]);

  // Load conversation messages when partner selected
  useEffect(() => {
    if (!selectedPartnerId) return;

    (async () => {
      const data = await getConversation(selectedPartnerId);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    })();
  }, [selectedPartnerId]);

  // Setup socket listeners
  useEffect(() => {
    connectSocket();

    const offOnline = socketService.onPresence((p: any) => {
      if (selectedPartnerId && String(p.userId) === String(selectedPartnerId)) setPartnerOnline(true);
    });

    const offOffline = socketService.onPresenceOff((p: any) => {
      if (selectedPartnerId && String(p.userId) === String(selectedPartnerId)) setPartnerOnline(false);
    });

    const offReceive = socketService.onReceiveMessage((msg: Message) => {
      // If chat is open with this user
      if (
        selectedPartnerId &&
        ((msg.sender_id === selectedPartnerId && msg.receiver_id === currentUserId) ||
          (msg.sender_id === currentUserId && msg.receiver_id === selectedPartnerId))
      ) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 50);
      }

      // Refresh conversation list to show new message preview
      getConversations().then(setConversations);
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
      if (selectedPartnerId && payload.from === selectedPartnerId) {
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
  }, [selectedPartnerId, currentUserId]);

  // Mark unread messages as read
  useEffect(() => {
    if (!selectedPartnerId) return;
    const unread = messages.filter(
      (m) => !m.read && m.receiver_id === currentUserId && m._id
    );
    unread.forEach((msg) => {
      socketService.emit("messageRead", { messageId: msg._id });
      markMessageRead(msg._id!);
    });
  }, [messages, currentUserId, selectedPartnerId]);

  // Handle send
  async function handleSend() {
    if (!text.trim() || !selectedPartnerId) return;

    const optimistic: Message = {
      sender_id: currentUserId!,
      receiver_id: selectedPartnerId,
      content: text,
      timestamp: new Date().toISOString(),
      delivered: false,
      read: false,
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    scrollToBottom();

    socketService.emit("sendMessage", optimistic);
    // Refresh list to update preview
    getConversations().then(setConversations);
  }

  // Emit typing
  useEffect(() => {
    if (!selectedPartnerId) return;
    const timeout = setTimeout(() => {
      emitTyping(selectedPartnerId, text.length > 0);
    }, 120);
    return () => clearTimeout(timeout);
  }, [text, selectedPartnerId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
        <div className="grid md:grid-cols-3 gap-6 h-full">

          {/* Conversations List */}
          <div className={`bg-card rounded-xl border shadow-sm flex flex-col ${selectedPartnerId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.partner._id}
                      onClick={() => setSelectedPartnerId(conv.partner._id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${selectedPartnerId === conv.partner._id ? "bg-muted" : ""
                        }`}
                    >
                      <Avatar>
                        <AvatarFallback>{conv.partner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-medium truncate">{conv.partner.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conv.lastMessage.timestamp || "").toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage.sender_id === currentUserId ? "You: " : ""}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={`md:col-span-2 bg-card rounded-xl border shadow-sm flex flex-col ${!selectedPartnerId ? 'hidden md:flex' : 'flex'}`}>
            {selectedPartnerId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedPartnerId(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <PresenceDot online={partnerOnline} />
                  <div>
                    <h2 className="font-semibold">
                      {conversations.find(c => c.partner._id === selectedPartnerId)?.partner.name || "Chat"}
                    </h2>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {partnerOnline ? "Online" : "Offline"}
                      {partnerTyping && <TypingDots />}
                    </div>
                  </div>
                </div>

                {/* Messages List */}
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
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

                {/* Input Area */}
                <div className="p-4 border-t bg-card">
                  <div className="flex items-center gap-3">
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
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8" />
                </div>
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
