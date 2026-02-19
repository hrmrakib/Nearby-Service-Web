"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const router = useRouter();

  //? get token
  useEffect(() => {
    const token = localStorage?.getItem("accessToken");
    if (token) {
      setToken(token);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    //? token is not ready
    if (!token) return;

    const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL;

    const newSocket = io(`${socket_url}/message`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: Number.MAX_SAFE_INTEGER, //? infinite
      reconnectionDelay: 3_000, //? 3 seconds
      auth: { token }, //? 1st try
      extraHeaders: {
        Authorization: `Bearer ${token}`, //? 2nd try
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      newSocket.on("online_users", (users: string[]) => {
        setOnlineUsers(users);
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);
  }, [token]);

  //? clean up
  useEffect(
    () => () => {
      socket?.disconnect();
    },
    [socket],
  );

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
