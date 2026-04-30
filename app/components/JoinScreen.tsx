"use client";

import { useState } from "react";
import { Room } from "../../types/chat";

interface Props {
  onJoin: (username: string, room: Room) => void;
  rooms: Room[];
}

export default function JoinScreen({ onJoin, rooms }: Props) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState<Room>("general");

  const handleJoin = () => {
    if (username.trim().length < 2) return;
    onJoin(username.trim(), room);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">💬 ChatFlow</h1>
          <p className="text-slate-400">Real-time chat — pick a name and jump in</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Your username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="e.g. Abdallah"
              maxLength={20}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1 block">Choose a room</label>
            <div className="grid grid-cols-2 gap-2">
              {rooms.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoom(r)}
                  className={`py-3 rounded-xl border font-medium transition capitalize ${
                    room === r
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  # {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={username.trim().length < 2}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition py-3 rounded-xl font-semibold text-lg mt-2"
          >
            Join Room →
          </button>
        </div>
      </div>
    </div>
  );
}