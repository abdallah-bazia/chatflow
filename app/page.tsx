"use client";

import { useState } from "react";
import ChatRoom from "./components/ChatRoom";
import JoinScreen from "./components/JoinScreen";
import { ROOMS, Room } from "../types/chat";

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<Room>("general");
  const [joined, setJoined] = useState(false);

  const handleJoin = (name: string, selectedRoom: Room) => {
    setUsername(name);
    setRoom(selectedRoom);
    setJoined(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {!joined ? (
        <JoinScreen onJoin={handleJoin} rooms={ROOMS} />
      ) : (
        <ChatRoom username={username} room={room} onLeave={() => setJoined(false)} />
      )}
    </main>
  );
}