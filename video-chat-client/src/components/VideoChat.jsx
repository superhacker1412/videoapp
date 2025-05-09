import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { LogOut } from "lucide-react";
import OnlineUsersList from "./OnlineUsersList";

const VideoChat = () => {
  const {
    authUser,
    logout,
    onlineUsers,
    initVideoChat,
    findRandom,
    stopFind,
    endCall,
    myId,
    partnerId,
    status,
    localStream,
    remoteStream,
    toggleVideo,
    toggleMute,
    isVideoOff,
    isMuted,
  } = useAuthStore((state) => state);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize video chat on mount
  useEffect(() => {
    initVideoChat();
  }, [initVideoChat]);

  // Attach local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Remote Video */}
      <div className="video-container w-full h-full flex justify-center items-center">
        {status === "inCall" && remoteStream ? (
          <div className="relative w-[70%] h-[70%]">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-1 right-1 bg-black bg-opacity-50 px-1 py-0.5 rounded text-white text-xs">
              {partnerId ? partnerId.substring(0, 8) : "Partner"}
            </div>
          </div>
        ) : (
          <div className="w-[70%] h-[70%]">
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-2xl font-bold">Waiting for peer...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Local Video (small overlay) */}
      <div className="absolute bottom-24 right-4 w-[200px] h-[150px] rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 right-1 bg-black bg-opacity-50 px-1 py-0.5 rounded text-white text-xs">
          You
        </div>
      </div>

      {/* Match counter */}
      <div className="absolute top-6 left-0 right-0 flex justify-center items-center z-20">
        <div className="px-6 py-3 bg-black bg-opacity-50 rounded-full backdrop-blur-sm flex items-center">
          <span className="text-match font-bold text-2xl mr-2">$match</span>
          <span className="text-white text-2xl">{onlineUsers.length}</span>
        </div>
      </div>

      {/* Searching overlay */}
      {status === "searching" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-2xl font-bold text-white">Searching for a peer...</p>
          </div>
        </div>
      )}

      {/* Control panel */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-20">
        <div className="p-2 bg-black bg-opacity-50 rounded-full backdrop-blur-sm flex items-center gap-2">
          <button
            onClick={findRandom}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            🔍 Find a peer
          </button>

          <button
            onClick={stopFind}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            ✋ Stop search
          </button>

          {status === "inCall" && (
            <button
              onClick={endCall}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              ❌ End Call
            </button>
          )}

          <button
            onClick={logout}
            className="flex gap-2 items-center px-4 py-2 rounded bg-gray-700 text-white ml-auto"
          >
            <LogOut size={16} />
            Log Out
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className={`${
              isMuted ? "bg-red-600" : "bg-gray-800"
            } w-12 h-12 rounded-full hover:bg-gray-700`}
          >
            <span className="text-white">{isMuted ? "🔊" : "🔇"}</span>
          </button>

          {/* Video On/Off Button */}
          <button
            onClick={toggleVideo}
            className={`${
              isVideoOff ? "bg-red-600" : "bg-gray-800"
            } w-12 h-12 rounded-full hover:bg-gray-700`}
          >
            <span className="text-white">{isVideoOff ? "🎬" : "🎥"}</span>
          </button>
        </div>
      </div>

      {/* Online Users List */}
      <div className="overflow-y-auto w-full py-3 mt-4 bg-blue-600 rounded-lg p-4">
        <OnlineUsersList />
      </div>
    </div>
  );
};

export default VideoChat;
