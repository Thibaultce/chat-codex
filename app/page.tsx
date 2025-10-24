import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 text-white">
      <div className="w-full max-w-3xl">
        <ChatWindow />
      </div>
    </main>
  );
}
