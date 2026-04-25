import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] relative overflow-hidden flex flex-col items-center justify-center px-6 selection:bg-[#ffb84d]/30 selection:text-[#ffb84d]">
      {/* Background with noise and gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <img src="/flies.gif" alt="bg" className="absolute top-0 left-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#131314]/50 to-[#131314]"></div>
      </div>

      {/* Fractal noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{ opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-20 w-full max-w-md">
        <header className="text-center mb-10">
          <div className="text-[32px] text-[#ffb84d] drop-shadow-[0_0_12px_rgba(255,184,77,0.3)] font-serif tracking-[0.02em] italic mb-2">
            Aethelgard AI
          </div>
          <p className="text-[#d6c4b0] text-sm font-body-md opacity-60">Authentication Protocol</p>
        </header>

        <div className="p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffb84d]/30 to-transparent" />
          
          {children}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[10px] font-label-sm tracking-[0.2em] text-zinc-500 uppercase">
             © 2024 PRISMATIC NOIR PROTOCOL
          </p>
        </footer>
      </div>
    </div>
  );
}
