

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/abdallah-bazia/chatflow.git
```

### 2. Start the Socket.io server

```bash
cd chatflow-server
npm install
npx tsx src/server.ts
# Server runs on http://localhost:3001
```

### 3. Start the Next.js frontend

```bash
cd chatflow
npm install
npm run dev
# App runs on http://localhost:3000
```

### 4. Open the app

Go to [http://localhost:3000](http://localhost:3000), pick a username, choose a room and start chatting!

> To test real-time features, open two browser tabs with different usernames in the same room.

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | Join a room with username |
| `send_message` | Client → Server | Send a message to the room |
| `typing` | Client → Server | Broadcast typing status |
| `message` | Server → Client | Receive a new message |
| `history` | Server → Client | Receive last 50 messages on join |
| `room_users` | Server → Client | Updated list of online users |

---

## 👤 Author

**Abdallah Bazia**
- GitHub: [@abdallah-bazia](https://github.com/abdallah-bazia)
- Portfolio: [portfolio-jet-three-82.vercel.app](https://portfolio-jet-three-82.vercel.app)