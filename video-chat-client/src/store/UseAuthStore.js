import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { BASE_URL, PORT, FRONTEND_PORT } from "./config.js";

const SOCKET_URL = "http://192.168.1.8:3000";
const PEER_SERVER_CONFIG = {
  host: "192.168.1.8",
  port: 9000,
  path: "/peerjs",
  secure: false,
};

export const useAuthStore = create((set, get) => ({
  // Auth state
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isCheckingAuth: true,
  onlineUsers: [],
  onlineUsersData: [], // Добавляем состояние для данных пользователей
  socket: null,

  // Video chat state
  peer: null,
  myId: "",
  partnerId: "",
  status: "idle", // idle | searching | inCall
  localStream: null,
  remoteStream: null,
  call: null,
  isMuted: false,  // Начальное состояние звука включено
  isVideoOff: false, // Начальное состояние видео включено

  // Auth actions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Video chat actions
  initVideoChat: () => {
    const { authUser } = get();
    if (!authUser) return;
  
    const socket = io(`${BASE_URL}:${PORT}`, {
      query: {
        userId: authUser._id,
      },
    });
  
    const peer = new Peer(undefined, PEER_SERVER_CONFIG);
    set({ socket, peer });
  
    peer.on("open", (id) => {
      set({ myId: id });
      socket.emit("register", id);
    });
  
    peer.on("call", (incomingCall) => {
      const { localStream } = get();
  
      if (!localStream) {
        console.warn("❗ localStream is not ready to answer call");
        return;
      }
  
      set({
        call: incomingCall,
        status: "inCall",
        partnerId: incomingCall.peer,
      });
  
      incomingCall.answer(localStream);
  
      incomingCall.on("stream", (remoteStream) => {
        set({ remoteStream });
      });
  
      incomingCall.on("close", get().cleanupCall);
    });
  
    // ✅ Исправленный обработчик получения онлайн-пользователей
    socket.on("getOnlineUsers", (userIds) => {
      const { onlineUsers } = get();
  
      const isSame =
        onlineUsers.length === userIds.length &&
        onlineUsers.every((id, i) => id === userIds[i]);
  
      if (!isSame) {
        set({ onlineUsers: userIds });
        get().fetchOnlineUsersData(userIds);
      }
    });
  
    socket.on("searching", () => set({ status: "searching" }));
    socket.on("stopped", () => set({ status: "idle" }));
  
    socket.on("start-call", (remotePeerId) => {
      const { peer, localStream } = get();
      if (!localStream) {
        console.warn("❗ localStream not ready for outgoing call");
        return;
      }
  
      set({ status: "inCall", partnerId: remotePeerId });
  
      const call = peer.call(remotePeerId, localStream);
      set({ call });
  
      call.on("stream", (remoteStream) => set({ remoteStream }));
      call.on("close", get().cleanupCall);
    });
  
    socket.on("end-call", () => get().cleanupCall());
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        set({ localStream: stream });
      })
      .catch((e) => {
        console.error("getUserMedia error", e);
      });
  },

  // Действие для получения данных о пользователях
  fetchOnlineUsersData: async (userIds) => {
    console.log('Fetching users for IDs:', userIds); // Логируем перед запросом
    try {
      const response = await axiosInstance.post("/users/list", { ids: userIds });
      console.log('Fetched user data:', response.data); // Логируем полученные данные
      set({ onlineUsersData: response.data });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error("Failed to load user data");
    }
  },

  // Функция для начала звонка
  startCall: (remotePeerId) => {
    const { peer, localStream } = get();
    if (!localStream) return;

    set({ status: "inCall", partnerId: remotePeerId });
    const call = peer.call(remotePeerId, localStream);
    set({ call });

    call.on("stream", (remoteStream) => set({ remoteStream }));
    call.on("close", get().cleanupCall);
  },

  findRandom: () => {
    get().socket?.emit("find-random");
    set({ status: "searching" });
  },

  stopFind: () => {
    get().socket?.emit("stop-find");
    set({ status: "idle" });
  },

  endCall: () => {
    const { call, socket } = get();
    call?.close();
    socket?.emit("end-call");
    get().cleanupCall();
  },

  cleanupCall: () => {
    set({ status: "idle", partnerId: "", call: null, remoteStream: null });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(`${BASE_URL}:${PORT}`, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      get().fetchOnlineUsersData(userIds);  // Запрашиваем данные пользователей, когда получаем их ID
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },

  // Мьютинг звука
  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMuted;  // Переключаем звук
      set({ isMuted: !isMuted });
    }
  },

  // Включение/выключение видео
  toggleVideo: () => {
    const { localStream, isVideoOff } = get();
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !isVideoOff;  // Переключаем видео
      set({ isVideoOff: !isVideoOff });
    }
  },
}));
