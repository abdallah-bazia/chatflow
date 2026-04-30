export interface Message {
  id: string;
  username: string;
  text: string;
  room: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  room: string;
}

export type Room = "general" | "tech" | "random" | "algeria";

export const ROOMS: Room[] = ["general", "tech", "random", "algeria"];