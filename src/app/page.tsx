"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

type PresentationStage = 'loading' | 'hero' | 'capabilities' | 'video' | 'ready';

export default function Home() {
  const [stage, setStage] = useState<PresentationStage>('loading');
  const [progress, setProgress] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stage === 'loading') {
      const duration = 4500;
      const interval = 30;
      const increment = 100 / (duration / interval);
      const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + increment));
      }, interval);

      const nextTimer = setTimeout(() => {
        setStage('hero');
      }, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(nextTimer);
      };
    }

    if (stage === 'hero') {
      const timer = setTimeout(() => setStage('capabilities'), 3500);
      return () => clearTimeout(timer);
    }

    if (stage === 'capabilities') {
      const timer = setTimeout(() => setStage('video'), 4000);
      return () => clearTimeout(timer);
    }

    if (stage === 'video') {
      const timer = setTimeout(() => setStage('ready'), 9000); // 9 seconds to comfortably watch the workflow animation
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handlePowerOn = () => {
    setIsPoweredOn(true);
  };

  return (
    <div className={`relative w-full transition-colors duration-[2000ms] ${isPoweredOn ? 'bg-black' : 'bg-zinc-950'} overflow-x-hidden ${stage !== 'ready' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      {/* SKIP BUTTON */}
      {stage !== 'loading' && stage !== 'ready' && !isPoweredOn && (
        <button 
          onClick={() => setStage('ready')}
          className="fixed bottom-10 right-10 z-[200] px-6 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 font-label-md text-[10px] tracking-widest uppercase animate-[fadeIn_1s_ease-out_forwards] flex items-center gap-2 group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
          Skip
          <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">skip_next</span>
        </button>
      )}
      {/* 1. EVOLUTION LOADER */}
      {stage === 'loading' && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen">
            <source src="/From%20KlickPin%20CF%20Pin%20on%20Pins%20von%20dir%20-%20Pin-37506609392419467.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex flex-col items-center font-label-md text-amber-500 tracking-[0.3em]">
            <span className="material-symbols-outlined text-[64px] mb-8 animate-spin text-amber-400 drop-shadow-[0_0_15px_rgba(255,184,77,0.8)]" data-icon="data_usage">data_usage</span>
            <div className="text-[14px] mb-4 uppercase text-white drop-shadow-md">Initializing Evolution Protocol</div>
            <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2 relative">
              <div className="absolute top-0 left-0 h-full bg-amber-400 shadow-[0_0_10px_rgba(255,184,77,1)]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 text-[10px] opacity-50 text-white font-mono tracking-widest">SYS.SYNC_ {Math.floor(progress)}%</div>
          </div>
        </div>
      )}

      {/* 2. PRESENTATION: HERO REVEAL */}
      <div className={`fixed inset-0 z-[150] transition-all duration-[1500ms] flex flex-col items-center justify-center bg-[#131314] ${stage === 'hero' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <img src="/download.gif" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-color-dodge" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-serif text-[50px] md:text-[80px] text-white mb-6 leading-tight opacity-0 animate-[fadeUp_1s_ease-out_forwards]">
            An Autonomous <span className="text-amber-400 italic">Agent</span><br />
            in the Cloud
          </h1>
          <p className="font-body-md text-white/40 max-w-xl mx-auto opacity-0 animate-[fadeUp_1s_ease-out_0.5s_forwards]">
            Establishing neural links across distributed repositories...
          </p>
        </div>
      </div>

      {/* 3. PRESENTATION: CAPABILITIES REVEAL */}
      <div className={`fixed inset-0 z-[140] transition-all duration-[1500ms] flex flex-col items-center justify-center bg-black ${stage === 'capabilities' ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
        <img src="/Glitch%20Glow%20GIF%20by%20Erica%20Anderson%20-%20Find%20&%20Share%20on%20GIPHY.gif" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
        <div className="max-w-6xl w-full px-10">
          <div className="mb-12 text-center">
            <span className="text-amber-500 font-label-sm tracking-[0.3em] uppercase">Architecture</span>
            <h2 className="text-white font-serif text-4xl mt-4">Integrated Sub-systems</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { 
                icon: 'database', 
                label: 'Codebase Ingestion', 
                desc: 'Deep-structure repository analysis mapped for semantic architecture understanding.',
                code: '01 / REPO_ANALYSIS',
                bgStyle: 'radial-gradient(circle at top left, rgba(255,184,77,0.15) 0%, transparent 70%)'
              },
              { 
                icon: 'hub', 
                label: 'Neural Synchronization', 
                desc: 'Multi-channel agent coordination designed for high-concurrency cognitive workloads.',
                code: '02 / SYNC_STATE',
                bgStyle: 'radial-gradient(circle at top right, rgba(255,184,77,0.1) 0%, transparent 60%)'
              },
              { 
                icon: 'query_stats', 
                label: 'Real-time Telemetry', 
                desc: 'Direct stream of cognitive throughput with sub-millisecond archival latency.',
                code: '03 / TELEMETRY_STREAM',
                bgStyle: 'radial-gradient(circle at bottom right, rgba(255,184,77,0.12) 0%, transparent 80%)'
              }
            ].map((item, i) => (
              <div 
                key={i} 
                className="relative overflow-hidden p-8 md:p-10 border border-white/10 bg-white/[0.02] backdrop-blur-md opacity-0 animate-[fadeUp_0.8s_ease-out_forwards] flex flex-col h-full shadow-[0_4px_24px_rgba(0,0,0,0.4)]" 
                style={{ animationDelay: `${0.2 * i}s` }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 opacity-50" style={{ background: item.bgStyle }} />
                
                {/* Top highlight border */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                
                {/* Content */}
                <div className="relative z-10 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <span className="material-symbols-outlined text-amber-400 text-[40px] drop-shadow-[0_0_12px_rgba(255,184,77,0.4)]">{item.icon}</span>
                    <div className="text-[10px] text-amber-500/50 tracking-widest font-mono border border-amber-500/20 rounded-full px-3 py-1 bg-amber-500/5">{item.code}</div>
                  </div>
                  <h3 className="text-white font-serif text-2xl md:text-3xl mb-4 leading-tight">{item.label}</h3>
                  <p className="text-white/50 font-body-md text-sm md:text-base leading-relaxed flex-grow">{item.desc}</p>
                  
                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 0L40 40L0 40" stroke="#FFB84D" strokeWidth="1.5" opacity="0.5"/>
                     </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PRESENTATION: WORKFLOW DEMO (Replacing Video) */}
      <div className={`fixed inset-0 z-[130] transition-all duration-[1500ms] bg-black flex items-center justify-center ${stage === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <img src="/TREYA%20Gradient.jpg" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-screen" />
        <div className="max-w-7xl w-full px-10 relative">
          
          <div className="text-center mb-24 opacity-0 animate-[fadeUp_0.8s_ease-out_forwards]">
            <span className="text-amber-500 font-label-sm tracking-[0.3em] uppercase block mb-4">Protocol Execution</span>
            <h2 className="text-white font-serif text-3xl md:text-5xl">Autonomous Workflow</h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
             {/* Step 1 - Activates instantly as beam starts */}
             <div className="relative z-10 flex flex-col items-center text-center opacity-0 animate-[fadeUp_1s_ease-out_forwards]" style={{ animationDelay: '0.8s' }}>
                {/* Horizontal Bridge to Step 2 (Desktop) */}
                <div className="hidden md:block absolute top-[80px] left-[calc(50%+80px)] w-[calc(100%+4rem-160px)] h-[2px] rounded-full overflow-hidden z-[-1]">
                  {stage === 'video' && <div className="h-full bg-gradient-to-r from-transparent to-amber-500/80 opacity-0 animate-[drawWidth_2s_linear_forwards]" style={{ animationDelay: '0.8s', width: '0%' }} />}
                  <div className="absolute inset-0 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '4.8s' }}>
                    <div className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-[flowRight_1s_linear_infinite]" />
                  </div>
                </div>
                {/* Vertical Bridge to Step 2 (Mobile) */}
                <div className="md:hidden absolute top-[160px] left-1/2 w-[2px] h-[calc(100%+2rem-160px)] -translate-x-1/2 rounded-full overflow-hidden z-[-1]">
                  {stage === 'video' && <div className="w-full h-full bg-gradient-to-b from-transparent to-amber-500/80 opacity-0 animate-[drawHeight_2s_linear_forwards]" style={{ animationDelay: '0.8s', height: '0%' }} />}
                  <div className="absolute inset-0 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '4.8s' }}>
                    <div className="absolute left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-amber-300 to-transparent animate-[flowDown_1s_linear_infinite]" />
                  </div>
                </div>

                <div className="w-40 h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,184,77,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/0 animate-[pulseGlow_2s_ease-out_forwards]" style={{ animationDelay: '0.8s' }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,77,0.1)_0%,transparent_70%)]" />
                  <span className="material-symbols-outlined text-[64px] text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover:scale-110">code_blocks</span>
                </div>
                <div className="font-label-sm text-amber-500 tracking-widest mb-3 border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/5 text-[10px]">STEP 01</div>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">Connect GitHub</h3>
                <p className="font-body-md text-white/50 text-sm md:text-base max-w-[250px] leading-relaxed">Securely authorize the agent to access your repository architecture.</p>
             </div>

             {/* Step 2 - Activates exactly as beam reaches 50% point */}
             <div className="relative z-10 flex flex-col items-center text-center opacity-0 animate-[fadeUp_1s_ease-out_forwards]" style={{ animationDelay: '2.8s' }}>
                {/* Horizontal Bridge to Step 3 (Desktop) */}
                <div className="hidden md:block absolute top-[80px] left-[calc(50%+80px)] w-[calc(100%+4rem-160px)] h-[2px] rounded-full overflow-hidden z-[-1]">
                  {stage === 'video' && <div className="h-full bg-gradient-to-r from-transparent to-amber-500/80 opacity-0 animate-[drawWidth_2s_linear_forwards]" style={{ animationDelay: '2.8s', width: '0%' }} />}
                  <div className="absolute inset-0 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '4.8s' }}>
                    <div className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-[flowRight_1s_linear_infinite]" />
                  </div>
                </div>
                {/* Vertical Bridge to Step 3 (Mobile) */}
                <div className="md:hidden absolute top-[160px] left-1/2 w-[2px] h-[calc(100%+2rem-160px)] -translate-x-1/2 rounded-full overflow-hidden z-[-1]">
                  {stage === 'video' && <div className="w-full h-full bg-gradient-to-b from-transparent to-amber-500/80 opacity-0 animate-[drawHeight_2s_linear_forwards]" style={{ animationDelay: '2.8s', height: '0%' }} />}
                  <div className="absolute inset-0 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '4.8s' }}>
                    <div className="absolute left-0 w-full h-[40%] bg-gradient-to-b from-transparent via-amber-300 to-transparent animate-[flowDown_1s_linear_infinite]" />
                  </div>
                </div>

                <div className="w-40 h-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,184,77,0.1)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/0 animate-[pulseGlow_2s_ease-out_forwards]" style={{ animationDelay: '2.8s' }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,77,0.1)_0%,transparent_70%)]" />
                  <span className="material-symbols-outlined text-[56px] text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover:scale-110">hub</span>
                </div>
                <div className="font-label-sm text-amber-500 tracking-widest mb-3 border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/5 text-[10px]">STEP 02</div>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">Link Telemetry</h3>
                <p className="font-body-md text-white/50 text-sm md:text-base max-w-[250px] leading-relaxed">Provide your Mail, Telegram, or Discord to establish communication.</p>
             </div>

             {/* Step 3 - Activates exactly as beam reaches 100% endpoint */}
             <div className="relative z-10 flex flex-col items-center text-center opacity-0 animate-[fadeUp_1s_ease-out_forwards]" style={{ animationDelay: '4.8s' }}>
                <div className="w-40 h-40 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-2xl hover:bg-amber-500/10 transition-colors duration-500 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,184,77,0.2)] relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-[ping_3s_ease-out_infinite]" style={{ animationDelay: '4.8s' }} />
                  <div className="absolute inset-0 bg-amber-500/0 animate-[pulseGlow_2s_ease-out_forwards]" style={{ animationDelay: '4.8s' }} />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,77,0.2)_0%,transparent_70%)]" />
                  <span className="material-symbols-outlined text-[64px] text-amber-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,184,77,0.6)]">visibility</span>
                </div>
                <div className="font-label-sm text-amber-500 tracking-widest mb-3 border border-amber-500/20 px-3 py-1 rounded-full bg-amber-500/5 text-[10px]">STEP 03</div>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">Autonomous Monitor</h3>
                <p className="font-body-md text-white/50 text-sm md:text-base max-w-[250px] leading-relaxed">The agent passively analyzes structures and streams actionable updates directly to you.</p>
             </div>
             
          </div>
        </div>
      </div>

      {/* 5. FINAL STATE: LANDING PAGE WITH POWER BUTTON */}
      <div className={`transition-opacity duration-[2000ms] ${stage === 'ready' ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden h-screen'}`}>
        
        {/* Main Interface Content */}
        {!isPoweredOn ? (
           <div className="fixed inset-0 w-full h-full z-[100] bg-black px-6">
              <img src="/look%20how%20it%20flies%20-%20do%20you%20want%20to_.gif" alt="bg" className="absolute top-0 left-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none" />
              
              <div className="absolute top-[20%] md:top-[25%] left-1/2 -translate-x-1/2 w-full text-center z-10 space-y-4">
                <h2 className="text-white font-serif text-5xl tracking-tight">System Ready.</h2>
                <p className="text-white/40 font-body-md max-w-sm mx-auto px-4">Aethelgard protocol is fully initialized and waiting for authorization.</p>
              </div>
              
              <div className="absolute bottom-[10%] md:bottom-[15%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                <button 
                  onClick={handlePowerOn}
                  className="group relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-[1.5px] border-orange-400 bg-orange-600 hover:bg-orange-500 transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_30px_rgba(249,115,22,0.9)] cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-full border border-orange-400 animate-[ping_2s_ease-out_infinite] opacity-60" />
                  <span className="material-symbols-outlined text-white text-[28px] md:text-[32px] transition-transform duration-500 group-hover:scale-110 group-active:scale-95 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">power_settings_new</span>
                </button>
                <div className="mt-8 text-orange-200 font-label-sm tracking-[0.4em] text-[10px] md:text-xs animate-pulse bg-orange-600/30 px-6 py-2 rounded-full border border-orange-500/50 backdrop-blur-lg">INITIATE_UP_LINK</div>
              </div>
           </div>
        ) : (
          <div className="bg-[#131314] text-[#e5e2e3] min-h-screen flex flex-col selection:bg-[#ffb84d]/30 selection:text-[#ffb84d] relative animate-[fadeIn_2s_ease-out]">
            {/* EXACT FRACTAL NOISE GRAIN OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-10" 
                 style={{ opacity: 0.05, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* TopAppBar */}
            <header className="bg-[#131314]/60 backdrop-blur-2xl border-b border-white/[0.03] shadow-[0_4px_60px_rgba(0,0,0,0.8)] fixed top-0 w-full z-50">
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
              <div className="flex justify-between items-center w-full px-8 py-5 max-w-screen-2xl mx-auto">
                <div className="text-[26px] text-[#ffb84d] drop-shadow-[0_0_12px_rgba(255,184,77,0.3)] font-serif tracking-[0.02em] italic">
                  Aethelgard AI
                </div>
                <nav className="hidden md:flex items-center gap-14">
                  <a className="text-[#b7b5b1] hover:text-white transition-all duration-300 tracking-[0.1em] font-serif italic text-sm relative group" href="#">
                    Status
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a className="text-[#b7b5b1] hover:text-white transition-all duration-300 tracking-[0.1em] font-serif italic text-sm relative group" href="#">
                    Archives
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a className="text-[#b7b5b1] hover:text-white transition-all duration-300 tracking-[0.1em] font-serif italic text-sm relative group" href="#">
                    Nexus
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </nav>
                <div className="flex items-center gap-6">
                  <button className="material-symbols-outlined text-[#b7b5b1] hover:text-[#ffb84d] hover:rotate-90 transition-all duration-700 p-2 text-[22px]">settings</button>
                  <button className="material-symbols-outlined text-[#b7b5b1] hover:text-[#ffb84d] transition-all duration-500 p-2 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</button>
                </div>
              </div>
            </header>

            {onboardingStep === 1 ? (
              <main className="flex-grow flex flex-col justify-center px-8 max-w-screen-2xl mx-auto w-full relative z-20 animate-[fadeIn_1s_ease-out] min-h-[calc(100vh-80px)]">
                {/* Main Content Canvas */}
                <div className="max-w-xl w-full relative mx-auto">
                  {/* Dithered Corner Accents */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2a2a2b 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2a2a2b 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  
                  <div className="text-center mb-10 relative z-20">
                    <span className="text-[11px] text-[#ffb84d] uppercase tracking-[0.3em] mb-2 block opacity-80 font-label-sm">Protocol Configuration</span>
                    <h1 className="text-4xl md:text-[48px] text-[#e5e2e3] mb-4 leading-[1.1] tracking-tight font-serif">Transmission Address</h1>
                    <p className="text-[15px] text-[#d6c4b0] max-w-md mx-auto italic leading-[1.5] font-body-md opacity-70">
                      Specify the designation for your daily intelligence reports and critical system alerts.
                    </p>
                  </div>

                  {/* Form Section */}
                  <div className="space-y-16 relative z-20">
                    <div className="relative group">
                      {/* Textured, Dithered Border Container */}
                      <div className="absolute inset-0 border border-[#514536]/30 group-focus-within:border-[#ffb84d]/50 transition-colors duration-700 pointer-events-none"></div>
                      {/* Decorative stippled halo */}
                      <div className="absolute -inset-2 bg-[#ffb84d]/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
                      
                      <div className="relative bg-[#1c1b1c] p-[1px]">
                        <label className="sr-only" htmlFor="transmission_email">Email Address</label>
                        <input 
                          className="w-full bg-transparent border-none text-[14px] font-label-sm text-[#e5e2e3] placeholder:text-[#353436] focus:ring-0 focus:outline-none px-6 py-8 uppercase tracking-[0.1em] text-center" 
                          id="transmission_email" 
                          placeholder="OPERATOR@AETHELGARD.VOID" 
                          type="email"
                        />
                      </div>
                      {/* Input underline that glows */}
                      <div className="h-[1px] w-full bg-[#1c1b1c] group-focus-within:bg-[#ffb84d] group-focus-within:shadow-[0_0_15px_rgba(255,184,77,0.5)] transition-all duration-700"></div>
                    </div>

                    <div className="flex flex-col items-center gap-5">
                      <button 
                        onClick={() => setOnboardingStep(2)}
                        className="group relative px-10 py-3.5 overflow-hidden bg-[#ffdcb0] text-[#452b00] text-[12px] font-label-md tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(255,184,77,0.3)] transition-all duration-500 flex items-center justify-center gap-3">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative z-10">Confirm Address</span>
                      </button>
                      <div className="flex items-center gap-2 opacity-30 text-[#e5e2e3]">
                        <span className="material-symbols-outlined text-[13px]">encrypted</span>
                        <span className="text-[9px] font-label-sm tracking-[0.05em]">E2E ENCRYPTION ACTIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Dithered Portrait Placeholder */}
                  <div className="mt-8 mb-6 border border-zinc-800/50 p-1.5 grayscale contrast-125 brightness-75 bg-[#131314] relative z-20">
                    <img alt="Abstract digital haze" className="w-full h-20 object-cover opacity-20 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY2IJJZvDqdzdOKQ6DPygBDDWGoUzV56yRgl1zFgVNqQvRybEsgj3eyaHfak5gljTvACCM251X-MTS9tx6NC7u9FFA2SHLJK-fLlHDgsetxKEFQ497U5ZfBKyhuE7Tnv24D40qTp8KIjBKmjRKzu49xOEy5GNQoF172V95qSFGaVKdbeMq3a1Q0HD4A87PZtXtDpmFbQZewqsuiXt38l6PBVleEWALkcssRS8JN7aTZnJWesb2L504hSsVTXKYvjayaRxz2UDWvA"/>
                  </div>
                </div>
              </main>
            ) : (
              <main className="flex-grow px-8 md:px-12 flex flex-col justify-center max-w-screen-2xl mx-auto w-full relative z-20 animate-[fadeIn_1s_ease-out] min-h-[calc(100vh-80px)]">
                <header className="max-w-4xl mb-12 text-center md:text-left">
                  <span className="font-label-sm text-[#ffb84d] mb-3 block uppercase tracking-[0.3em] text-[10px] opacity-90">Protocol Extension</span>
                  <h1 className="font-serif text-5xl md:text-[60px] text-[#e5e2e3] mb-5 italic tracking-tighter font-light leading-[1]">Secondary Channels</h1>
                  <p className="font-body-md text-[#d6c4b0] max-w-2xl mx-auto md:mx-0 text-[16px] leading-[1.6] opacity-70">
                    Bridge the Aethelgard lattice to your priority environments for real-time telemetry and rapid autonomous command execution.
                  </p>
                </header>

                {/* Bento Grid / Triple Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  
                  {/* Gmail Card */}
                  <div className="group relative p-1 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-[#ffb84d]/40 hover:shadow-[0_0_30px_rgba(255,184,77,0.15)] bg-[#131314]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,184,77,0.1) 0%, transparent 100%)', maskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', WebkitMaskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', maskSize: '2px 2px', WebkitMaskSize: '2px 2px' }}></div>
                    <div className="relative p-6 lg:p-7 flex flex-col h-full bg-[#0e0e0f]/60 backdrop-blur-md rounded-lg">
                      <div className="mb-6 flex justify-between items-start">
                        <div className="w-10 h-10 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[#ffb84d]/10 rounded-full blur-xl group-hover:bg-[#ffb84d]/20 transition-all duration-700"></div>
                          <img alt="Gmail Logo" className="w-6 h-6 relative z-10 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"/>
                        </div>
                        <span className="font-label-sm px-2.5 py-1 border border-white/10 rounded-full text-zinc-400 uppercase text-[9px] tracking-widest bg-black/20">Latency: 8ms</span>
                      </div>
                      <h2 className="font-serif text-[22px] text-[#e5e2e3] mb-2">Gmail</h2>
                      <p className="font-body-md text-[#d6c4b0]/70 mb-6 flex-grow text-[13px] leading-relaxed">
                        Standardized intel drops and periodic archiving. Ensures complete historical records of agent activity.
                      </p>
                      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mt-auto pt-6 border-t border-white/5 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">database</span> SMTP Sync
                          </div>
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">history</span> Archival
                          </div>
                        </div>
                        <button className="px-6 py-2.5 bg-[#1c1b1c] border border-white/10 text-white font-label-md rounded hover:bg-white/10 active:scale-95 transition-all duration-300 text-[11px] uppercase tracking-widest flex-shrink-0 w-full 2xl:w-auto mt-2 2xl:mt-0 shadow-lg">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Telegram Card */}
                  <div className="group relative p-1 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-[#ffb84d]/40 hover:shadow-[0_0_30px_rgba(255,184,77,0.15)] bg-[#131314]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,184,77,0.1) 0%, transparent 100%)', maskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', WebkitMaskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', maskSize: '2px 2px', WebkitMaskSize: '2px 2px' }}></div>
                    <div className="relative p-6 lg:p-7 flex flex-col h-full bg-[#0e0e0f]/60 backdrop-blur-md rounded-lg">
                      <div className="mb-6 flex justify-between items-start">
                        <div className="w-10 h-10 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[#ffb84d]/10 rounded-full blur-xl group-hover:bg-[#ffb84d]/20 transition-all duration-700"></div>
                          <img alt="Telegram Logo" className="w-6 h-6 relative z-10 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"/>
                        </div>
                        <span className="font-label-sm px-2.5 py-1 border border-white/10 rounded-full text-zinc-400 uppercase text-[9px] tracking-widest bg-black/20">Latency: 12ms</span>
                      </div>
                      <h2 className="font-serif text-[22px] text-[#e5e2e3] mb-2">Telegram</h2>
                      <p className="font-body-md text-[#d6c4b0]/70 mb-6 flex-grow text-[13px] leading-relaxed">
                        Direct P2P command interface with end-to-end encrypted telemetry. Ideal for mobile-first monitoring.
                      </p>
                      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mt-auto pt-6 border-t border-white/5 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">lock</span> Encrypted
                          </div>
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">bolt</span> Push Alerts
                          </div>
                        </div>
                        <button className="px-6 py-2.5 bg-[#ffb84d] text-[#452b00] font-label-md rounded border-none hover:shadow-[0_0_20px_rgba(255,184,77,0.4)] hover:bg-[#ffdcb0] active:scale-95 transition-all duration-300 text-[11px] uppercase tracking-widest font-semibold flex-shrink-0 w-full 2xl:w-auto mt-2 2xl:mt-0">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Discord Card */}
                  <div className="group relative p-1 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl overflow-hidden transition-all duration-500 hover:border-[#ffb84d]/40 hover:shadow-[0_0_30px_rgba(255,184,77,0.15)] bg-[#131314]">
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,184,77,0.1) 0%, transparent 100%)', maskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', WebkitMaskImage: 'radial-gradient(circle at center, black 1px, transparent 0)', maskSize: '2px 2px', WebkitMaskSize: '2px 2px' }}></div>
                    <div className="relative p-6 lg:p-7 flex flex-col h-full bg-[#0e0e0f]/60 backdrop-blur-md rounded-lg">
                      <div className="mb-6 flex justify-between items-start">
                        <div className="w-10 h-10 relative flex items-center justify-center">
                          <div className="absolute inset-0 bg-[#ffb84d]/10 rounded-full blur-xl group-hover:bg-[#ffb84d]/20 transition-all duration-700"></div>
                          <img alt="Discord Logo" className="w-6 h-6 relative z-10 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 object-contain" src="https://cdn.simpleicons.org/discord"/>
                        </div>
                        <span className="font-label-sm px-2.5 py-1 border border-white/10 rounded-full text-zinc-400 uppercase text-[9px] tracking-widest bg-black/20">Latency: 24ms</span>
                      </div>
                      <h2 className="font-serif text-[22px] text-[#e5e2e3] mb-2">Discord</h2>
                      <p className="font-body-md text-[#d6c4b0]/70 mb-6 flex-grow text-[13px] leading-relaxed">
                        Rich media reporting and collaborative command environment. Perfect for team-based observation.
                      </p>
                      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between mt-auto pt-6 border-t border-white/5 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">group</span> Guild-Ready
                          </div>
                          <div className="flex items-center text-zinc-500 uppercase tracking-widest text-[9px] font-label-sm">
                            <span className="material-symbols-outlined text-[13px] mr-2">database</span> Archive Sync
                          </div>
                        </div>
                        <button className="px-6 py-2.5 bg-transparent border border-white/20 text-[#e5e2e3] font-label-md rounded hover:border-[#ffb84d] hover:text-[#ffb84d] active:scale-95 transition-all duration-300 text-[11px] uppercase tracking-widest flex-shrink-0 w-full 2xl:w-auto mt-2 2xl:mt-0">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <section className="mt-12 pt-6 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity duration-700 mb-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#ffb84d] text-[18px]">info</span>
                      <p className="font-label-sm text-zinc-400 uppercase text-[9px] tracking-widest">Processed through the Prismatic Noir Bridge Protocol.</p>
                    </div>
                    <p className="font-label-sm text-zinc-500 underline cursor-help text-[10px] tracking-widest uppercase">Security Manifesto</p>
                  </div>
                </section>
              </main>
            )}

            {/* Footer */}
            <footer className="fixed bottom-0 w-full flex justify-between items-center px-10 py-8 opacity-60 pointer-events-none">
              <div className="font-serif text-[10px] tracking-[0.2em] uppercase text-zinc-600">
                © 2024 PRISMATIC NOIR PROTOCOL. ALL RIGHTS RESERVED.
              </div>
              <div className="flex gap-8 pointer-events-auto">
                <a className="font-serif text-[10px] tracking-[0.2em] uppercase text-zinc-600 hover:text-amber-500 transition-colors duration-300" href="#">Manifesto</a>
                <a className="font-serif text-[10px] tracking-[0.2em] uppercase text-zinc-600 hover:text-amber-500 transition-colors duration-300" href="#">Security</a>
                <a className="font-serif text-[10px] tracking-[0.2em] uppercase text-zinc-600 hover:text-amber-500 transition-colors duration-300" href="#">Assistance</a>
              </div>
            </footer>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawWidth {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes pulseGlow {
          0% { opacity: 0; transform: scale(1); background-color: rgba(255,184,77,0); }
          20% { opacity: 1; transform: scale(1.1); background-color: rgba(255,184,77,0.2); }
          100% { opacity: 0; transform: scale(1.5); background-color: rgba(255,184,77,0); }
        }
        @keyframes drawHeight {
          0% { height: 0%; opacity: 0; }
          5% { opacity: 1; }
          100% { height: 100%; opacity: 1; }
        }
        @keyframes flowRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(500%); }
        }
        @keyframes flowDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
      `}</style>
    </div>
  );
}
