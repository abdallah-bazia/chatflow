import { Message } from "../../types/chat";

interface Props {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: Props) {
  const isSystem = message.username === "System";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSystem) {
    return (
      <div className="text-center text-slate-500 text-xs py-1 italic">
        {message.text}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      <span className="text-xs text-slate-500 mb-1 px-1">
        {!isOwn && <span className="text-purple-400 font-medium">{message.username} · </span>}
        {time}
      </span>
      <div
        className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm ${
          isOwn
            ? "bg-purple-600 text-white rounded-tr-sm"
            : "bg-white/10 text-slate-200 rounded-tl-sm"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}