# Chat Demo

Chat Demo is a real-time messaging experience built with the Next.js 14 App Router, Tailwind CSS, and TypeScript. A dedicated Node.js backend powered by Express and Socket.IO manages WebSocket connections, enabling instantaneous message delivery across connected clients.

## Features

- ⚡️ Real-time bidirectional messaging via Socket.IO
- 🧭 App Router-based Next.js UI written in modern TypeScript
- 🎨 Tailwind CSS styling with a dark-friendly layout
- 🧱 Modular structure with shared components, library utilities, and typed message contracts
- 🩺 Health-check endpoint for quick backend diagnostics

## Tech Stack

- Frontend: Next.js 14, React 19, App Router, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Tooling: TypeScript, ESLint

## Project Structure

```
app/                # App Router entrypoints and layouts
components/         # Reusable UI components (chat window, inputs, lists)
lib/                # Frontend utilities (e.g., Socket.IO client singleton)
server/             # Express + Socket.IO backend server
types/              # Shared TypeScript contracts for chat messages
public/             # Static assets served by Next.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create an `.env.local` file for the Next.js app (optional). The default values work out of the box, but you can override them:

```bash
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

For the backend, you can optionally set:

```bash
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

### 3. Run the servers

In one terminal, start the backend:

```bash
npm run server
```

In a separate terminal, start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to interact with the chat UI.

## Available Scripts

- `npm run dev` – Launches the Next.js development server.
- `npm run build` – Creates a production build of the frontend.
- `npm run start` – Starts the Next.js production server.
- `npm run lint` – Runs ESLint over the project.
- `npm run server` – Starts the Express + Socket.IO backend.

## Development Notes

- The frontend and backend run independently; make sure both processes are active for local testing.
- Message contracts live in `types/chat.ts` and are shared between the UI and the real-time events.
- The Socket.IO client is initialized once in `lib/socket.ts`; reuse it across client components to avoid duplicate connections.
