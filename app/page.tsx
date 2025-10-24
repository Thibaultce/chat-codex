import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.22),_transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.08)_8%,rgba(217,70,239,0.05)_45%,transparent_70%)] mix-blend-screen"
      />
      <div className="relative w-full max-w-4xl">
        <ChatWindow />
      </div>
    </main>
  );
}
