"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Send, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSocket } from "@/provider/SocketProvider";
import { useParams, useRouter } from "next/navigation";
import {
  useGetInboxChatsQuery,
  useGetMessagesQuery,
  useNewChatMutation,
} from "@/redux/features/chat/chatAPI";
import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface IChat {
  id: string;
  name: string;
  user_id: string;
  avatar: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
  unread_count: number;
}

interface IMessage {
  id: string;
  created_at: string;
  updated_at: string;
  chat_id: string;
  parent_id: string | null;
  user_id: string;
  text: string;
  media_urls: string[];
  isDeleted: boolean;
  seen_by: string[];
  isOwner: boolean;
}

export default function MessagesPage() {
  const { socket, onlineUsers } = useSocket();
  const { id: chat_id } = useParams<{ id: string }>();
  const router = useRouter();

  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setHasToken(!!localStorage?.getItem("access_token"));
  }, []);

  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  const [selectedContact, setSelectedContact] = useState<IChat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: inboxChats, refetch: inboxRefetch } = useGetInboxChatsQuery({
    page: 1,
    limit: 10,
    search: debouncedSearch,
    unread: activeTab,
  });

  console.log({ inboxChats });

  const {
    data: messagesResponse,
    refetch: refetchMessages,
    isFetching: isFetchingMessages,
  } = useGetMessagesQuery(
    { page, limit, chat_id, search: undefined },
    { skip: !chat_id },
  );

  const messagesData = messagesResponse?.data || [];
  const totalPages = messagesResponse?.meta?.pagination?.totalPages;

  // Merge paginated messages (no duplicates)
  useEffect(() => {
    if (!messagesData?.length) return;
    setMessages((prev) => {
      const newItems = messagesData.filter(
        (msg: any) => !prev.some((p) => p.id === msg.id),
      );
      return [...newItems, ...prev];
    });
  }, [messagesData]);

  // Sync selected contact from URL
  useEffect(() => {
    if (!inboxChats?.data || !chat_id) return;
    const contact = inboxChats.data.find((c: IChat) => c.id === chat_id);
    if (contact) {
      setSelectedContact(contact);
      if (window.innerWidth < 768) setShowChat(true);
    }
  }, [chat_id, inboxChats]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (isFetchingMessages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "20px", threshold: 0.1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [isFetchingMessages, messages]);

  // Socket: receive new messages
  useEffect(() => {
    if (!socket) return;
    const handler = (payload: any) => {
      const message = JSON.parse(payload).data;
      if (message.chat_id !== chat_id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };
    socket.on("new_message", handler);
    return () => {
      socket.off("new_message", handler);
    };
  }, [socket, chat_id]);

  const [newChat] = useNewChatMutation();

  const handleConversationSelect = async (contact: IChat) => {
    if (window.innerWidth < 768) setShowChat(true);
    const data = await newChat({ user_id: contact.user_id }).unwrap();
    const chatId = data?.data?.id;
    if (!chatId) return;
    if (chatId !== chat_id) {
      setSelectedContact(contact);
      setMessages([]); // reset messages for new chat
      setPage(1);
      router.replace(`/dashboard/message/${chatId}`);
      inboxRefetch();
      refetchMessages();
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !socket || !chat_id) return;

    const tempMessage: IMessage = {
      id: crypto.randomUUID(),
      chat_id: String(chat_id),
      text: messageText,
      user_id: profile?.data?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      parent_id: null,
      media_urls: [],
      isDeleted: false,
      seen_by: [],
      isOwner: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    socket.emit("send_message", {
      chat_id: String(chat_id),
      text: messageText,
    });
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (ts?: string) => {
    if (!ts) return "";
    return ts.split("T")[1]?.split(".")[0] || "";
  };

  return (
    <div className='flex min-h-[calc(100vh-90px)] bg-gray-50'>
      {/* Sidebar */}
      <div
        className={cn(
          "w-full md:w-80 bg-white border-r border-gray-200 flex-col",
          showChat ? "hidden md:flex" : "flex",
        )}
      >
        <div className='p-4 border-b'>
          <h1 className='text-lg font-semibold mb-3'>All Messages</h1>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              className='pl-10 bg-gray-100 border-0'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Unread / All tabs */}
        <div className='px-4 py-2 border-b flex gap-6'>
          <button
            onClick={() => setActiveTab(false)}
            className={`text-sm pb-2 border-b-2 ${
              !activeTab
                ? "text-[#0A5512] border-[#0A5512]"
                : "text-gray-500 border-transparent"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab(true)}
            className={`text-sm pb-2 border-b-2 ${
              activeTab
                ? "text-[#0A5512] border-[#0A5512]"
                : "text-gray-500 border-transparent"
            }`}
          >
            Unread
          </button>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {inboxChats?.data?.map((contact: IChat) => (
            <div
              key={contact.id}
              onClick={() => handleConversationSelect(contact)}
              className={cn(
                "flex gap-3 p-4 cursor-pointer hover:bg-gray-50",
                selectedContact?.id === contact.id && "bg-green-50",
              )}
            >
              {/* Avatar with online indicator */}
              <div className='relative'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + contact.avatar}
                  />
                  <AvatarFallback>
                    {contact?.name
                      ?.split(" ")
                      ?.map((n) => n[0])
                      ?.join("")}
                  </AvatarFallback>
                </Avatar>
                {onlineUsers.includes(contact.user_id) && (
                  <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-center'>
                  <p className='font-medium truncate'>{contact?.name}</p>
                  {contact.unread_count > 0 && (
                    <span className='text-xs bg-[#0A5512] text-white px-2 rounded-full ml-1'>
                      {contact.unread_count}
                    </span>
                  )}
                </div>
                <p className='text-sm text-gray-600 line-clamp-1'>
                  {contact?.last_message?.slice(0, 40)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !showChat ? "hidden md:flex" : "flex",
        )}
      >
        {!selectedContact ? (
          <div className='flex flex-1 items-center justify-center text-gray-500'>
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='p-4 bg-white border-b flex items-center gap-3'>
              <button
                onClick={() => setShowChat(false)}
                className='md:hidden flex items-center gap-2 text-green-700 font-medium'
              >
                <ArrowLeft className='w-4 h-4' /> Back
              </button>

              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_URL +
                        selectedContact.avatar
                      }
                    />
                    <AvatarFallback>
                      {selectedContact?.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(selectedContact.user_id) && (
                    <div className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full' />
                  )}
                </div>

                <div>
                  <p className='font-medium'>{selectedContact?.name}</p>
                  <p className='text-xs text-gray-500'>
                    {onlineUsers.includes(selectedContact.user_id)
                      ? "Active now"
                      : `Last seen ${formatTime(selectedContact.timestamp)}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {/* Infinite scroll loader at top */}
              <div ref={loaderRef} className='h-4' />

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.isOwner ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl max-w-[75%] sm:max-w-xs lg:max-w-md",
                      msg.isOwner
                        ? "bg-[#0A5512] text-white"
                        : "bg-gray-100 text-gray-900",
                    )}
                  >
                    <p className='text-sm'>{msg.text}</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 mt-1 text-xs opacity-70",
                        msg.isOwner ? "justify-end" : "justify-start",
                      )}
                    >
                      {dayjs(msg.updated_at || msg.created_at).fromNow()}
                      {msg.isOwner && msg.seen_by.length > 1 && (
                        <CheckCheck className='w-3 h-3 text-blue-200' />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='p-4 bg-white border-t flex gap-2'>
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='Type your message...'
                className='h-12'
              />
              <Button
                onClick={handleSendMessage}
                className='rounded-full w-10 h-10 p-0 bg-[#0A5512]'
              >
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// "use client";

// import type React from "react";
// import { useState, useEffect, useRef } from "react";
// import { ArrowLeft, Search, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
// import { SocketProvider } from "@/provider/SocketProvider";

// interface Conversation {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unread?: number;
//   online?: boolean;
//   typing?: boolean;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "other";
//   timestamp: string;
//   status?: "sent" | "delivered" | "read";
//   conversationId: string;
// }

// const conversations: Conversation[] = [
//   {
//     id: "1",
//     name: "Jennifer Markus",
//     avatar: "/professional-woman.png",
//     lastMessage:
//       "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//     timestamp: "Today | 05:30 PM",
//     unread: 2,
//     online: true,
//   },
//   {
//     id: "2",
//     name: "Iva Ryan",
//     avatar: "/woman-designer.png",
//     lastMessage: "Thanks for the quick turnaround on the project!",
//     timestamp: "Today | 04:15 PM",
//     online: false,
//   },
//   {
//     id: "3",
//     name: "Jerry Helfer",
//     avatar: "/man-developer.png",
//     lastMessage: "Can we schedule a call for tomorrow?",
//     timestamp: "Yesterday | 11:20 AM",
//     unread: 1,
//     online: true,
//   },
//   {
//     id: "4",
//     name: "David Elson",
//     avatar: "/business-man.png",
//     lastMessage: "The client approved the final designs",
//     timestamp: "Yesterday | 09:45 AM",
//     online: false,
//   },
//   {
//     id: "5",
//     name: "Mary Freund",
//     avatar: "/woman-manager.png",
//     lastMessage: "Let's discuss the budget allocation",
//     timestamp: "Monday | 03:30 PM",
//     online: true,
//   },
// ];

// const initialMessages: Record<string, Message[]> = {
//   "1": [
//     {
//       id: "1",
//       text: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
//       sender: "other",
//       timestamp: "05:25 PM",
//       status: "read",
//       conversationId: "1",
//     },
//     {
//       id: "2",
//       text: "Oh, hello! All perfectly. I will check it and get back to you soon",
//       sender: "user",
//       timestamp: "05:27 PM",
//       status: "delivered",
//       conversationId: "1",
//     },
//     {
//       id: "3",
//       text: "Great! Also, could you review the color palette?",
//       sender: "other",
//       timestamp: "05:30 PM",
//       status: "sent",
//       conversationId: "1",
//     },
//   ],
// };

// export default function MessagesPage() {
//   const [selectedConversation, setSelectedConversation] = useState("1");
//   const [messageText, setMessageText] = useState("");
//   const [messages, setMessages] =
//     useState<Record<string, Message[]>>(initialMessages);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [conversationList, setConversationList] =
//     useState<Conversation[]>(conversations);

//   const [showChat, setShowChat] = useState(false); // ✅ mobile toggle
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const currentConversation = conversationList.find(
//     (c) => c.id === selectedConversation,
//   );

//   const currentMessages = messages[selectedConversation] || [];

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [currentMessages]);

//   const handleSendMessage = () => {
//     if (!messageText.trim()) return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text: messageText,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       status: "sent",
//       conversationId: selectedConversation,
//     };

//     setMessages((prev) => ({
//       ...prev,
//       [selectedConversation]: [
//         ...(prev[selectedConversation] || []),
//         newMessage,
//       ],
//     }));

//     setConversationList((prev) =>
//       prev.map((conv) =>
//         conv.id === selectedConversation
//           ? { ...conv, lastMessage: messageText, timestamp: "Now" }
//           : conv,
//       ),
//     );

//     setMessageText("");
//     setIsTyping(true);

//     setTimeout(() => {
//       setIsTyping(false);
//     }, 2000);
//   };

//   const handleConversationSelect = (id: string) => {
//     setSelectedConversation(id);
//     setShowChat(true);
//     setConversationList((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
//     );
//   };

//   const filteredConversations = conversationList.filter(
//     (c) =>
//       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   return (
//     <SocketProvider>
//       <div className='flex min-h-[calc(100vh-90px)] bg-gray-50'>
//         {/* Sidebar */}
//         <div
//           className={cn(
//             "w-full md:w-80 bg-white border-r border-gray-200 flex-col",
//             showChat ? "hidden md:flex" : "flex",
//           )}
//         >
//           <div className='p-4 border-b'>
//             <h1 className='text-lg font-semibold mb-3'>All Messages</h1>
//             <div className='relative'>
//               <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
//               <Input
//                 className='pl-10 bg-gray-100 border-0'
//                 placeholder='Search'
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className='flex-1 overflow-y-auto'>
//             {filteredConversations.map((c) => (
//               <div
//                 key={c.id}
//                 onClick={() => handleConversationSelect(c.id)}
//                 className={cn(
//                   "flex gap-3 p-4 cursor-pointer hover:bg-gray-50",
//                   selectedConversation === c.id && "bg-green-50",
//                 )}
//               >
//                 <Avatar className='w-10 h-10'>
//                   <AvatarImage src={c.avatar} />
//                   <AvatarFallback>{c.name[0]}</AvatarFallback>
//                 </Avatar>
//                 <div className='flex-1'>
//                   <div className='flex justify-between'>
//                     <p className='font-medium'>{c.name}</p>
//                     {c.unread && (
//                       <span className='text-xs bg-[#0A5512] text-white px-2 rounded-full'>
//                         {c.unread}
//                       </span>
//                     )}
//                   </div>
//                   <p className='text-sm text-gray-600 line-clamp-1'>
//                     {c.lastMessage}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat */}
//         <div
//           className={cn(
//             "flex-1 flex flex-col",
//             !showChat ? "hidden md:flex" : "flex",
//           )}
//         >
//           <div className='p-4 bg-white border-b flex items-center justify-between gap-3'>
//             <button
//               onClick={() => setShowChat(false)}
//               className='md:hidden flex items-center gap-2 text-green-700 font-medium'
//             >
//               <ArrowLeft className='w-4 h-4' /> Back
//             </button>

//             <div className='flex items-center gap-3'>
//               <Avatar className='w-8 h-8'>
//                 <AvatarImage src={currentConversation?.avatar} />
//                 <AvatarFallback>{currentConversation?.name[0]}</AvatarFallback>
//               </Avatar>

//               <div>
//                 <p className='font-medium'>{currentConversation?.name}</p>
//                 <p className='text-xs text-gray-500'>
//                   {currentConversation?.online ? "Active now" : "Offline"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className='flex-1 overflow-y-auto p-4 space-y-4'>
//             {currentMessages.map((m) => (
//               <div
//                 key={m.id}
//                 className={cn(
//                   "flex",
//                   m.sender === "user" ? "justify-end" : "justify-start",
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "px-4 py-2 rounded-2xl max-w-[75%] sm:max-w-xs lg:max-w-md",
//                     m.sender === "user"
//                       ? "bg-[#0A5512] text-white"
//                       : "bg-gray-100",
//                   )}
//                 >
//                   <p className='text-sm'>{m.text}</p>
//                   <p className='text-xs mt-1 opacity-70'>{m.timestamp}</p>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className='p-4 bg-white border-t flex gap-2'>
//             <Input
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               placeholder='Type your message...'
//               className='h-12'
//             />
//             <Button
//               onClick={handleSendMessage}
//               className='rounded-full w-10 h-10 p-0 bg-[#0A5512]'
//             >
//               <Send className='w-4 h-4' />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </SocketProvider>
//   );
// }
