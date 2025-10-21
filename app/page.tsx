import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="w-full max-w-3xl">
        <ChatWindow />
      </div>
    </main>
  );
}
