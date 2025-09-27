"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, Send, MoreVertical, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  typing?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  conversationId: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Jennifer Markus",
    avatar: "/professional-woman.png",
    lastMessage:
      "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
    timestamp: "Today | 05:30 PM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Iva Ryan",
    avatar: "/woman-designer.png",
    lastMessage: "Thanks for the quick turnaround on the project!",
    timestamp: "Today | 04:15 PM",
    online: false,
  },
  {
    id: "3",
    name: "Jerry Helfer",
    avatar: "/man-developer.png",
    lastMessage: "Can we schedule a call for tomorrow?",
    timestamp: "Yesterday | 11:20 AM",
    unread: 1,
    online: true,
  },
  {
    id: "4",
    name: "David Elson",
    avatar: "/business-man.png",
    lastMessage: "The client approved the final designs",
    timestamp: "Yesterday | 09:45 AM",
    online: false,
  },
  {
    id: "5",
    name: "Mary Freund",
    avatar: "/woman-manager.png",
    lastMessage: "Let's discuss the budget allocation",
    timestamp: "Monday | 03:30 PM",
    online: true,
  },
];

const initialMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      text: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
      sender: "other",
      timestamp: "05:25 PM",
      status: "read",
      conversationId: "1",
    },
    {
      id: "2",
      text: "Oh, hello! All perfectly. I will check it and get back to you soon",
      sender: "user",
      timestamp: "05:27 PM",
      status: "delivered",
      conversationId: "1",
    },
    {
      id: "3",
      text: "Great! Also, could you review the color palette?",
      sender: "other",
      timestamp: "05:30 PM",
      status: "sent",
      conversationId: "1",
    },
  ],
  "2": [
    {
      id: "4",
      text: "Thanks for the quick turnaround on the project!",
      sender: "other",
      timestamp: "04:15 PM",
      status: "read",
      conversationId: "2",
    },
  ],
  "3": [
    {
      id: "5",
      text: "Can we schedule a call for tomorrow?",
      sender: "other",
      timestamp: "11:20 AM",
      status: "sent",
      conversationId: "3",
    },
  ],
  "4": [
    {
      id: "6",
      text: "The client approved the final designs",
      sender: "other",
      timestamp: "09:45 AM",
      status: "read",
      conversationId: "4",
    },
  ],
  "5": [
    {
      id: "7",
      text: "Let's discuss the budget allocation",
      sender: "other",
      timestamp: "03:30 PM",
      status: "read",
      conversationId: "5",
    },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(
    initialMessages
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationList, setConversationList] = useState(conversations);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversationList.find(
    (c) => c.id === selectedConversation
  );
  const currentMessages = messages[selectedConversation] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      conversationId: selectedConversation,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [
        ...(prev[selectedConversation] || []),
        newMessage,
      ],
    }));

    // Update conversation list with new last message
    setConversationList((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: messageText,
              timestamp: "Now",
            }
          : conv
      )
    );

    setMessageText("");
    setIsTyping(true);

    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you soon.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        conversationId: selectedConversation,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: [
          ...(prev[selectedConversation] || []),
          autoReply,
        ],
      }));
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversationList.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setConversationList((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  return (
    <div className='flex min-h-[calc(100vh-90px)] bg-gray-50'>
      {/* Left Sidebar - Conversations */}
      <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
        {/* Sidebar Header */}
        <div className='p-4 border-b border-gray-200'>
          <h1 className='text-lg font-semibold text-gray-900 mb-3'>
            All Messages
          </h1>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-gray-300'
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className='flex-1 overflow-y-auto'>
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation.id)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors relative",
                selectedConversation === conversation.id && "bg-green-50"
              )}
            >
              <div className='relative'>
                <Avatar className='w-10 h-10 flex-shrink-0'>
                  <AvatarImage
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                  />
                  <AvatarFallback>
                    {conversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='font-medium text-gray-900 truncate'>
                    {conversation.name}
                  </h3>
                  {conversation.unread && conversation.unread > 0 && (
                    <span className='bg-[#0A5512] text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center'>
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
                  {conversation.lastMessage}
                </p>
                <div className='flex items-center justify-between text-xs text-gray-400'>
                  <span>{conversation.timestamp}</span>
                  {conversation.typing && (
                    <span className='text-[#0A5512] font-medium'>
                      typing...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Chat Header */}
        <div className='bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Avatar className='w-8 h-8'>
                <AvatarImage
                  src={currentConversation?.avatar || "/placeholder.svg"}
                  alt={currentConversation?.name}
                />
                <AvatarFallback>
                  {currentConversation?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {currentConversation?.online && (
                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full'></div>
              )}
            </div>
            <div>
              <h2 className='font-medium text-gray-900'>
                {currentConversation?.name}
              </h2>
              <p className='text-xs text-gray-500'>
                {currentConversation?.online
                  ? "Active now"
                  : "Last seen recently"}
              </p>
            </div>
          </div>
          {/* <div className='flex items-center gap-2'>
            <Button variant='ghost' size='sm'>
              <Phone className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm'>
              <Video className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm'>
              <Info className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm'>
              <MoreVertical className='w-4 h-4' />
            </Button>
          </div> */}
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                  message.sender === "user"
                    ? "bg-[#0A5512] text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <p className='text-sm'>{message.text}</p>
                <div className='flex items-center justify-between mt-1'>
                  <p
                    className={cn(
                      "text-xs",
                      message.sender === "user"
                        ? "text-green-100"
                        : "text-gray-500"
                    )}
                  >
                    {message.timestamp}
                  </p>
                  {message.sender === "user" && (
                    <span className='text-xs text-green-100 ml-2'>
                      {message.status === "sent" && "✓"}
                      {message.status === "delivered" && "✓✓"}
                      {message.status === "read" && "✓✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className='flex justify-start'>
              <div className='bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl'>
                <div className='flex space-x-1'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className='bg-white border-t border-gray-200 p-4'>
          <div className='flex items-center gap-2'>
            <div className='flex-1 relative'>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message here...'
                className='pr-12 h-12 border-gray-300 focus-visible:ring-green-500 focus-visible:border-green-500'
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              size='sm'
              className='bg-[#0A5512] hover:bg-green-700 text-white rounded-full w-10 h-10 p-0'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
