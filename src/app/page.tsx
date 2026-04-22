"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate initial protocol loading & evolution sequence
    const duration = 4500; // 4.5 seconds
    const interval = 30; // smooth 30ms updates
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + increment;
      });
    }, interval);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 800); // Start fading 800ms before removing

    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {/* Evolution Sequence Loader */}
      {showLoader && (
        <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-1000 flex flex-col items-center justify-center ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
          >
            <source src="/From%20KlickPin%20CF%20Pin%20on%20Pins%20von%20dir%20-%20Pin-37506609392419467.mp4" type="video/mp4" />
          </video>
          
          <div className="relative z-10 flex flex-col items-center font-label-md text-amber-500 tracking-[0.3em]">
            <span className="material-symbols-outlined text-[48px] md:text-[64px] mb-8 animate-[spin_3s_linear_infinite] text-amber-400 drop-shadow-[0_0_15px_rgba(255,184,77,0.8)]" data-icon="data_usage">
              data_usage
            </span>
            <div className="text-[12px] md:text-[14px] mb-4 opacity-90 uppercase text-white drop-shadow-md">
              Initializing Evolution Protocol
            </div>
            
            {/* Minimalist Progress Array */}
            <div className="w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-amber-400 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(255,184,77,1)]"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-4 text-[10px] opacity-50 text-white font-mono tracking-widest">
              SYS.SYNC_ {Math.min(Math.floor(progress), 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Entire Scrollable Page Layout */}
      <div className="w-full flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative">
        
        {/* HERO SECTION (Strict 100vh bound logic mapped as scrolling origin) */}
        <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background GIF Layer (Locked contextually to Hero bound instead of the viewport) */}
          <img
            src="/download.gif"
            alt="Animated background"
            className="absolute top-0 left-0 min-w-full min-h-[100vh] object-cover z-[-1] pointer-events-none mix-blend-color-dodge opacity-30 blur-[2px]"
          />

          {/* Extreme Minimalist Glass Navbar */}
          <header className="absolute top-0 z-50 w-full bg-transparent">
            <div className="flex justify-between items-center w-full px-8 md:px-12 py-8 max-w-screen-2xl mx-auto">
              {/* Left Brand */}
              <div className="text-xl md:text-2xl font-serif font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] tracking-tight">
                Aethelgard AI
              </div>
              
              {/* Right Action */}
              <button className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-[13px] font-label-md text-white backdrop-blur-md">
                Initialize Link
              </button>
            </div>
          </header>

          {/* Main Content Envelope */}
          <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center px-6 pt-12 md:pt-0">
            {/* Headline inspired by Construct Computer */}
            <h1 className="font-serif text-[44px] md:text-[68px] lg:text-[76px] leading-[1.05] tracking-tight text-white mb-6 font-medium">
              An Autonomous <span className="text-amber-400 italic">Agent</span> in the Cloud<br />
              Powered by <span className="text-amber-400 italic">Aethelgard</span>
            </h1>

            {/* Subtle Description */}
            <p className="font-body-md text-white/50 max-w-[500px] text-center leading-relaxed text-[15px] md:text-[17px] mb-14 drop-shadow-lg">
              An AI agent that browses the web, analyzes repositories, and establishes secure developmental context. Watch it work in real-time.
            </p>

            {/* Central Hero Visage (The Shiny Element) */}
            <div className="relative mb-16 drop-shadow-[0_0_40px_rgba(255,184,77,0.3)] group cursor-pointer transition-transform duration-700 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full scale-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
              <div className="w-40 h-40 md:w-48 md:h-48 border border-white/10 rounded-[40px] md:rounded-[48px] flex items-center justify-center bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl relative overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffb84d_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-[48px]"></div>
                <span className="material-symbols-outlined text-[80px] md:text-[96px] text-amber-300 drop-shadow-[0_0_25px_rgba(255,184,77,0.9)] relative z-10 transition-transform duration-500 group-hover:scale-110" data-icon="hub">
                  hub
                </span>
              </div>
            </div>

            {/* Call to Action Button */}
            <button className="group relative px-8 py-3.5 bg-transparent border border-white/20 text-white font-label-md text-[14px] rounded-full overflow-hidden transition-all duration-500 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(255,184,77,0.2)] active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Connect GitHub Account
              </span>
              <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <div className="mt-8 flex items-center gap-1.5 opacity-20 hover:opacity-100 transition-opacity duration-300 cursor-help group">
              <span className="material-symbols-outlined text-[14px]" data-icon="lock">
                lock
              </span>
              <span className="font-label-sm text-white tracking-widest text-[10px] uppercase">Encrypted End-to-End Tunnel</span>
            </div>
          </div>
        </section>

        {/* REST OF PAGE (Inherits the pure globals.css ASCII matrix) */}
        
        {/* Feature Section (Bento Inspired Grid) */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-24 mt-8 md:mt-24 z-10 w-full relative">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-8">
            <div className="max-w-xl">
              <span className="font-label-md text-amber-500 block mb-4 tracking-widest text-[11px] uppercase">Capabilities</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium">Integrated Sub-systems</h2>
            </div>
            <p className="font-body-md text-white/50 max-w-sm italic leading-relaxed">
              The protocol enables deep-structure analysis across fragmented data silos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Card 1 */}
            <div 
              className="group relative p-10 md:p-12 border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-amber-500/30 overflow-hidden"
              style={{ background: 'radial-gradient(circle at top left, rgba(255,184,77,0.15) 0%, transparent 70%)' }}>
              <div className="mb-10 text-amber-500">
                <span className="material-symbols-outlined text-4xl">database</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">Codebase Ingestion</h3>
              <p className="font-body-md text-white/50 mb-8 leading-relaxed">
                Deep-structure repository analysis providing semantic understanding across legacy architectures.
              </p>
              <div className="font-label-sm text-white/30 group-hover:text-amber-500 transition-colors tracking-widest text-[10px]">
                01 / REPO_ANALYSIS
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-amber-500/20 text-6xl">grid_4x4</span>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="group relative p-10 md:p-12 border border-amber-500/20 bg-amber-500/5 transition-all duration-700 hover:border-amber-500/50 overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,184,77,0.05) 1px, transparent 0)', backgroundSize: '4px 4px' }}>
              <div className="mb-10 text-amber-500">
                <span className="material-symbols-outlined text-4xl">hub</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">Neural Synchronization</h3>
              <p className="font-body-md text-white/50 mb-8 leading-relaxed">
                Multi-channel agent coordination designed for high-concurrency cognitive workloads.
              </p>
              <div className="font-label-sm text-amber-500 tracking-widest text-[10px]">
                02 / SYNC_STATE
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full"></div>
            </div>

            {/* Card 3 */}
            <div 
              className="group relative p-10 md:p-12 border border-white/5 bg-white/[0.02] transition-all duration-700 hover:border-amber-500/30 overflow-hidden"
              style={{ background: 'radial-gradient(circle at top left, rgba(255,184,77,0.15) 0%, transparent 70%)' }}>
              <div className="mb-10 text-amber-500">
                <span className="material-symbols-outlined text-4xl">query_stats</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">Real-time Telemetry</h3>
              <p className="font-body-md text-white/50 mb-8 leading-relaxed">
                Direct stream of cognitive throughput with sub-millisecond archival latency.
              </p>
              <div className="font-label-sm text-white/30 group-hover:text-amber-500 transition-colors tracking-widest text-[10px]">
                03 / TELEMETRY_STREAM
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-amber-500/20 text-6xl">data_exploration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Section */}
        <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-16 md:py-32 z-10 w-full border-t border-white/5 mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative p-1 border border-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,184,77,0.05) 1px, transparent 0)', backgroundSize: '4px 4px' }}>
                <img 
                  alt="Technological abstract" 
                  className="w-full grayscale opacity-40 mix-blend-screen" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2_CDfhqTs3d8fsnU3mMMi1zjH-yMc4gICLtdCBHw_wKgRT4EyiVngKJoq3r6okRAAfa63KSafdS2QBZ_iTh7_UpYs97JYTPTAYGokrR1HT7nNgGadCBbfL5-0gzwJBSHb45BL8e6QSIi5J-PrxgYTxjuG0SJVOgJPSMxlsvf273AF41X5u_7EzGdXkj-vJmcE54VJc6G5XN5OUnffneRwg89eOfUqvH91WZiTSb3PezaDHc5m9eT0SgzQmYSME3LrAJ3Z4dum7A"
                />
                <div className="absolute inset-0 border-[20px] border-[#131314]/80"></div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h4 className="font-label-md text-amber-500 mb-6 tracking-[0.4em] text-[11px] uppercase">System Identity</h4>
              <h2 className="font-serif text-4xl md:text-[56px] text-white md:mb-8 mb-6 leading-[1.1] font-medium">Beyond the standard algorithmic envelope.</h2>
              <p className="font-body-lg text-white/50 mb-10 leading-relaxed text-[15px] md:text-[17px]">
                Aethelgard represents a shift in intelligence architecture. By treating data not as a static resource, but as a prismatic spectrum of possibilities, we enable insights that were previously obscured by the noise of legacy logic.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 border-l-2 border-amber-500/20 pl-6 py-2">
                  <div>
                    <h5 className="font-label-md text-white tracking-widest text-[11px] mb-1 uppercase">Zero-Knowledge Protocols</h5>
                    <p className="font-body-md text-white/40 text-xs md:text-sm">Archival integrity without exposure.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 border-l-2 border-amber-500/20 pl-6 py-2">
                  <div>
                    <h5 className="font-label-md text-white tracking-widest text-[11px] mb-1 uppercase">Heuristic Resonance</h5>
                    <p className="font-body-md text-white/40 text-xs md:text-sm">Self-optimizing cognitive loops.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Component from HTML */}
        <footer className="w-full border-t border-white/5 mt-16 md:mt-24 bg-[#0a0a0a] z-10 relative">
          <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-12 md:py-16 gap-8 w-full max-w-screen-2xl mx-auto">
            <div className="flex flex-col gap-2 md:items-start items-center">
              <div className="font-serif text-white/60 uppercase tracking-tighter text-lg font-medium">AETHELGARD</div>
              <p className="font-serif italic text-[10px] md:text-xs tracking-widest text-white/30">© 2026 AETHELGARD. ARCHIVAL CORE v1.0</p>
            </div>
            <div className="flex gap-6 md:gap-12 text-center">
              <a className="font-serif italic text-[10px] md:text-[11px] tracking-widest text-white/40 hover:text-amber-400 transition-colors duration-500" href="#">Terms of Access</a>
              <a className="font-serif italic text-[10px] md:text-[11px] tracking-widest text-white/40 hover:text-amber-400 transition-colors duration-500" href="#">System Privacy</a>
              <a className="font-serif italic text-[10px] md:text-[11px] tracking-widest text-white/40 hover:text-amber-400 transition-colors duration-500" href="#">Encrypted Signal</a>
            </div>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-white/30 hover:text-amber-500 cursor-pointer transition-colors text-xl">hub</span>
              <span className="material-symbols-outlined text-white/30 hover:text-amber-500 cursor-pointer transition-colors text-xl">shield_with_heart</span>
              <span className="material-symbols-outlined text-white/30 hover:text-amber-500 cursor-pointer transition-colors text-xl">terminal</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
