export default function BackgroundAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      <div className="fixed top-[-10%] left-[-10%] h-1/2 w-1/2 rounded-full bg-blue-900/40 blur-[120px]" />
      <div className="fixed top-[25%] left-[30%] h-2/5 w-2/5 rounded-full bg-indigo-900/40 blur-[120px]" />
      <div className="fixed top-[45%] right-[-10%] h-1/2 w-1/2 rounded-full bg-cyan-900/30 blur-[120px]" />
    </div>
  );
}
