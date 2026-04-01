"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Loader2, Search, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ChatInterfaceProps {
  isAdmin?: boolean;
  orderId?: string;
}

export function ChatInterface({ isAdmin = false, orderId }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Poll for messages every 3 seconds for simple "real-time"
  const { data: chatData, mutate: refreshMessages } = useSWR(
    isAdmin 
      ? (selectedUser ? `/api/support/chat?userId=${selectedUser}` : `/api/support/chat`) 
      : `/api/support/chat`, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  const messages = (isAdmin && selectedUser) || !isAdmin ? chatData?.data || [] : [];
  const conversations = isAdmin && !selectedUser ? chatData?.data || [] : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUser]);

  // Mark as read when messages are viewed
  useEffect(() => {
    if (user && messages.length > 0) {
      const unreadSentByOther = messages.some((m: any) => m.sender._id !== user._id && !m.isRead);
      if (unreadSentByOther) {
        const senderId = isAdmin ? selectedUser : messages.find((m: any) => m.sender.role === 'admin')?.sender._id;
        if (senderId) {
          fetch(`/api/support/chat?senderId=${senderId}`, { method: 'PATCH' });
        }
      }
    }
  }, [messages, user, isAdmin, selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => { e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: isAdmin ? selectedUser : undefined,
          orderId: orderId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMessage("");
        refreshMessages();
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isAdmin && !selectedUser) {
    return (
      <div className="flex flex-col h-[600px] border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Support Inbox
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
              <p>No active conversations yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv: any) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedUser(conv._id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={conv.customer?.avatar} />
                    <AvatarFallback><UserIcon /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold truncate">{conv.customer?.name}</p>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(conv.lastMessage.createdAt), "p")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate italic">
                      {conv.lastMessage.role === 'admin' ? "You: " : ""}{conv.lastMessage.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px]">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-2xl bg-card shadow-lg relative overflow-hidden bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-muted/40 flex items-center gap-3">
        {isAdmin && (
          <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-10 w-10 border shadow-sm ring-1 ring-primary/5">
          <AvatarImage src={isAdmin ? "/api/placeholder/100" : "/api/placeholder/100"} />
          <AvatarFallback><UserIcon /></AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-base leading-tight">
            {isAdmin ? "User Support Chat" : "Support Team"}
          </h3>
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-foreground">How can we help?</h4>
              <p className="text-sm text-muted-foreground px-10">
                Start a conversation with our {isAdmin ? "customer" : "support team"}.
              </p>
            </div>
          ) : (
            messages.map((m: any) => {
              const isMe = m.sender._id === user?._id;
              return (
                <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                        isMe 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-muted text-foreground rounded-tl-none"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1 font-medium italic">
                      {format(new Date(m.createdAt), "p")}
                      {isMe && m.isRead && " • Seen"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/10 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-full border-muted-foreground/20 focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!newMessage.trim() || isSending} 
          className="rounded-full shadow-lg shadow-primary/20 shrink-0"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
