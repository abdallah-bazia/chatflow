"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../lib/socket";
import { Message, User, Room } from "../../types/chat";
import MessageBubble from "./MessageBubble";

interface Props {
  username: string;
  room: Room;
  onLeave: () => void;
}

export default function ChatRoom({ username, room, onLeave }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socket = getSocket();

  useEffect(() => {
    socket.connect();
    socket.emit("join", { username, room });

    socket.on("history", (msgs: Message[]) => setMessages(msgs));
    socket.on("message", (msg: Message) => setMessages((prev) => [...prev, msg]));
    socket.on("room_users", (roomUsers: User[]) => setUsers(roomUsers));
    socket.on("typing", ({ username: u, isTyping }: { username: string; isTyping: boolean }) => {
      setTyping(isTyping ? u : null);
    });

    return () => {
      socket.off("history");
      socket.off("message");
      socket.off("room_users");
      socket.off("typing");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", { text: input.trim() });
    setInput("");
    socket.emit("typing", false);
  };

  const handleTyping = (val: string) => {
    setInput(val);
    socket.emit("typing", true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => socket.emit("typing", false), 1500);
  };

  const handleLeave = () => {
    socket.disconnect();
    onLeave();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-56 bg-white/5 border-r border-white/10 flex flex-col p-4 hidden sm:flex">
        <div className="mb-6">
          <h2 className="text-xl font-bold">💬 ChatFlow</h2>
          <p className="text-slate-400 text-sm mt-1">#{room}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Online — {users.length}</p>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className={u.username === username ? "text-purple-400 font-medium" : "text-slate-300"}>
                  {u.username} {u.username === username && "(you)"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLeave}
          className="mt-auto text-sm text-slate-500 hover:text-red-400 transition"
        >
          ← Leave room
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg capitalize"># {room}</h3>
            <p className="text-slate-400 text-xs">{users.length} online</p>
          </div>
          <button onClick={handleLeave} className="sm:hidden text-slate-400 hover:text-red-400 transition text-sm">
            Leave
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {messages.map((msg, index) => (
  <MessageBubble key={`${msg.id}-${index}`} message={msg} isOwn={msg.username === username} />
           ) )}
          {typing && (
            <p className="text-slate-500 text-xs italic px-2">{typing} is typing...</p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 px-4 py-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Message #${room}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 transition px-5 py-3 rounded-xl font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}