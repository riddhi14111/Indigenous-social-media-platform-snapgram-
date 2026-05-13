import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "./authStore";

const SocketContext = createContext(null);

// ✅ THIS IS REQUIRED (your error fix)
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const ringTimeoutRef = useRef(null);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId: user._id },
        withCredentials: true,
      });

      newSocket.on("onlineUsers", (users) => setOnlineUsers(users));

      newSocket.on("newNotification", () =>
        setNotifCount((c) => c + 1)
      );

      newSocket.on("incomingCall", ({ from, fromName, fromAvatar, offer }) => {
        setIncomingCall({
          partnerId: from,
          partnerName: fromName || "Unknown",
          partnerAvatar: fromAvatar || "",
          offer,
          isIncoming: true,
        });

        if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);

        ringTimeoutRef.current = setTimeout(() => {
          newSocket.emit("rejectCall", { to: from });
          setIncomingCall(null);
        }, 30000);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        notifCount,
        setNotifCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};