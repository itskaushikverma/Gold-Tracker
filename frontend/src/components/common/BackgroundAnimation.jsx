import { MotionDiv } from './MotionWrapper';

export default function BackgroundAnimation() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-30" />

      <MotionDiv
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-blue-900/20 blur-[120px]"
      />
      <MotionDiv
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[50%] -right-[10%] h-[50%] w-[50%] rounded-full bg-cyan-900/10 blur-[120px]"
      />
      <MotionDiv
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[20%] left-[30%] h-[40%] w-[40%] rounded-full bg-indigo-900/10 blur-[120px]"
      />
    </div>
  );
}
