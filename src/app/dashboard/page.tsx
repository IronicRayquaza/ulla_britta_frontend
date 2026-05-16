"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Terminal, MessageSquare, LogOut, Copy, Check, Zap, Bot, Settings, Activity, ShieldCheck, Cpu } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'success';
  service: string;
  message: string;
  repo: string;
  user_id?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [islandWidth, setIslandWidth] = useState(320);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSendingPulse, setIsSendingPulse] = useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Good afternoon, Operator. Aethelgard is synchronized. How shall we proceed with the mission?" }
  ]);

  const contentRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const router = useRouter();

  const statuses = [
    { text: "SIGNAL: ACTIVE", icon: <Activity size={14} className="text-emerald-500 animate-pulse" /> },
    { text: "TELEMETRY: LIVE", icon: <Cpu size={14} className="text-amber-500" /> },
    { text: "LATTICE: SYNCHED", icon: <ShieldCheck size={14} className="text-blue-400" /> }
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: realUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !realUser) { router.push('/auth/login'); return; }
      setUser(realUser);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', realUser.id).maybeSingle();
      setProfile(profileData);
      if (profileData) {
        try {
          const { data: initialLogs } = await supabase.from('agent_logs').select('*').order('timestamp', { ascending: true }).limit(100);
          if (initialLogs) setLogs(initialLogs);
        } catch (err) { console.warn("Fetch Error:", err); }
      }
    };
    checkUser();
  }, [router, supabase]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel('user-agent-logs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, (payload) => {
      setLogs(prev => [...prev, payload.new as LogEntry]);
    }).subscribe();
    return () => { channel.unsubscribe(); };
  }, [user?.id, supabase]);

  useEffect(() => {
    const interval = setInterval(() => { setCurrentStatusIndex((prev) => (prev + 1) % statuses.length); }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) { setIslandWidth(contentRef.current.scrollWidth + 100); }
  }, [currentStatusIndex]);

  useEffect(() => { if (showLogs) setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }, [logs, showLogs]);

  const sendTestPulse = async () => {
    if (!user) return;
    setIsSendingPulse(true);
    const { error } = await supabase.from('agent_logs').insert({
      user_id: user.id,
      level: 'success',
      service: 'diagnostics',
      message: 'TRANSMITTING NEURAL PULSE... SIGNAL RECEIVED.',
      repo: 'aethelgard-core'
    });
    if (error) console.error("Pulse Failure:", error);
    setTimeout(() => setIsSendingPulse(false), 2000);
  };

  if (!user || isSigningOut) {
    return (
      <div className="bg-[#0b0b0c] h-screen flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 border border-white/10 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-[10px] text-zinc-600 tracking-[0.4em] uppercase">Reversing Bridge...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#040405] text-[#e5e2e3] h-screen flex flex-col relative overflow-hidden font-sans">

      {/* HIGH-FIDELITY ATMOSPHERE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#040405]" />
        {/* Using a high-quality ambient noise pattern and deep radial gradients */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://grain-y.com/wp-content/uploads/2021/02/Grainy-Texture-1.jpg')] bg-repeat" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040405]/50 to-[#040405]" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-amber-500/[0.03] to-transparent" />
      </div>

      {/* HEADER: PRISMATIC NOIR ALIGNMENT */}
      <header className="fixed top-0 w-full z-[100] px-12 py-10 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-serif italic text-white/90 tracking-tight leading-none mb-2 drop-shadow-2xl">Aethelgard</h1>
          <div onClick={() => { navigator.clipboard.writeText(user.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors shadow-lg" />
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.3em] group-hover:text-amber-500/80 transition-colors">
              {copied ? 'IDENTITY COPIED' : `NEURAL KEY: ${user.id.substring(0, 8)}...`}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center flex-1">
          <div
            className="h-11 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-full flex items-center px-8 transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative pointer-events-auto group hover:border-amber-500/30"
            style={{ width: `${islandWidth}px` }}
          >
            <div className="flex items-center gap-4 w-full whitespace-nowrap overflow-hidden">
              {statuses[currentStatusIndex].icon}
              <span ref={contentRef} className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/90 drop-shadow-md">{statuses[currentStatusIndex].text}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 pointer-events-auto">
          <button onClick={() => setShowLogs(true)} className="text-zinc-500 hover:text-amber-500 transition-all font-mono text-[10px] tracking-[0.2em] uppercase">Telemetry</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login'); }} className="material-symbols-outlined text-zinc-500 hover:text-red-400 transition-all text-[20px]">logout</button>
          <div className="w-10 h-10 rounded-full border border-white/10 p-[2px] bg-black shadow-2xl relative overflow-hidden group">
            <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`} className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
            <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </header>

      {/* CENTER CONSOLE: THE GRID */}
      <main className="flex-grow z-10 flex flex-col items-center justify-center relative px-8">
        <div className="w-full max-w-2xl text-center space-y-24">

          <div className="relative inline-block animate-[fadeIn_1.5s_ease-out]">
            <div className="w-40 h-40 rounded-full border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent flex items-center justify-center relative shadow-[0_0_80px_rgba(255,255,255,0.02)]">
              <Bot size={72} className="text-zinc-800 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
              <div className="absolute -inset-8 border border-white/[0.01] rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-16 border border-white/[0.01] rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 rounded-full px-5 py-2 flex items-center gap-3 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-mono text-white/70 tracking-[0.3em] uppercase">Bridge Active</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto">
            <button onClick={() => setShowLogs(true)} className="group p-10 bg-black/40 border border-white/[0.05] rounded-[2.5rem] hover:bg-amber-500/[0.02] hover:border-amber-500/20 transition-all duration-700 text-left pointer-events-auto shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity"><Terminal size={40} /></div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] mb-2 group-hover:text-amber-500/80 transition-colors">Uplink: Telemetry</p>
              <p className="text-sm text-zinc-400 font-medium tracking-tight">Monitor Live Channel</p>
            </button>
            <button onClick={() => setShowChat(true)} className="group p-10 bg-black/40 border border-white/[0.05] rounded-[2.5rem] hover:bg-amber-500/[0.02] hover:border-amber-500/20 transition-all duration-700 text-left pointer-events-auto shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity"><MessageSquare size={40} /></div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] mb-2 group-hover:text-amber-500/80 transition-colors">Nexus: Secretary</p>
              <p className="text-sm text-zinc-400 font-medium tracking-tight">Commander Portal</p>
            </button>
          </div>
        </div>
      </main>

      {/* TELEMETRY FEED: SIDE DRAWER ARCHITECTURE */}
      <div
        className={`fixed inset-y-0 right-0 w-[580px] z-[200] transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${showLogs ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full bg-black/95 backdrop-blur-3xl border-l border-white/10 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.8)]">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div>
              <h3 className="text-xs font-mono tracking-[0.5em] uppercase text-zinc-500 mb-1">Intelligence Stream</h3>
              <p className="text-[9px] font-mono text-amber-500/40 uppercase tracking-widest leading-none">Diagnostic Capture: Active</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); sendTestPulse(); }}
              disabled={isSendingPulse}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 pointer-events-auto shadow-2xl ${isSendingPulse ? 'bg-amber-500 text-black border-amber-500' : 'bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/20 hover:border-amber-500/40'}`}
            >
              <Zap size={14} className={isSendingPulse ? 'animate-bounce' : ''} />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold">{isSendingPulse ? 'SYNCING...' : 'TEST SIGNAL'}</span>
            </button>
          </div>
          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar font-mono text-[12px] space-y-8">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className="animate-fadeIn transition-all group flex gap-6 border-l border-white/5 pl-6 py-1 hover:border-amber-500/30">
                <span className="text-zinc-800 tabular-nums font-bold">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <div className="flex-grow">
                  <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 block ${log.level === 'success' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>[{log.service}]</span>
                  <p className="text-zinc-400 group-hover:text-zinc-100 leading-relaxed transition-colors uppercase text-[11px] font-medium">{log.message}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                <Activity size={40} className="animate-pulse text-zinc-500" />
                <p className="text-[11px] uppercase tracking-[0.6em] text-center leading-loose">Awaiting Telemetry Packet<br /><span className="text-[9px] opacity-50">Handshake Pending</span></p>
              </div>
            )}
            <div ref={logEndRef} />
          </div>
          <div className="p-10 border-t border-white/5 bg-black">
            <button onClick={() => setShowLogs(false)} className="w-full py-5 border border-white/10 rounded-2xl text-[11px] font-mono tracking-[0.4em] uppercase text-zinc-600 hover:text-amber-500 hover:border-amber-500/30 transition-all duration-500">Close Telemetry</button>
          </div>
        </div>
      </div>

      {/* SECRETARY INTERFACE */}
      <div className={`fixed inset-0 z-[250] flex items-center justify-center p-8 transition-opacity duration-700 ${showChat ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={() => setShowChat(false)} className="absolute inset-0 bg-[#040405]/80 backdrop-blur-md pointer-events-auto" />
        <div className="relative w-full max-w-3xl bg-[#040405] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col h-[75vh] shadow-[0_50px_150px_rgba(0,0,0,0.9)] pointer-events-auto border-t-white/15">
          <div className="p-12 border-b border-white/5 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-500/50" />
            <p className="text-base font-serif italic text-white/60 tracking-wider">A.V.A Nexus Secretary</p>
          </div>
          <div className="flex-grow overflow-y-auto p-12 custom-scrollbar space-y-16">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'bg-amber-500/10 border border-amber-500/20 px-10 py-6 text-right' : 'flex-1'} rounded-[2.5rem]`}>
                  <p className="text-base text-zinc-300 font-serif italic leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (!chatInput.trim()) return; setMessages(prev => [...prev, { role: "user", content: chatInput }]); setChatInput(""); }} className="p-12 pt-0">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Enter mission parameters..." className="w-full bg-white/[0.02] border border-white/5 rounded-full px-10 py-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-serif italic shadow-inner" />
          </form>
        </div>
      </div>

    </div>
  );
}
