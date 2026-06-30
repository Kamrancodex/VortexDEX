import { SwapFeature } from '@/components/swap/swap-feature';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background orbs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] animate-float"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-float-delayed"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
      </div>

      {/* Swap widget */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <SwapFeature />
      </div>
    </div>
  );
}
