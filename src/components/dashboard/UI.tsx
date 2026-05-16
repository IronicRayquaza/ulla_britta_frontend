'use client';

import React, { useState, useEffect } from 'react';
import { useCityStore } from '@/lib/store';
import { Activity, Box, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UI() {
  const [mounted, setMounted] = useState(false);
  const repos = useCityStore((state) => state.repos);
  const selectedRepo = useCityStore((state) => state.selectedRepo);
  const setSelectedRepo = useCityStore((state) => state.setSelectedRepo);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedData = repos.find((r) => r.id === selectedRepo);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Top Console */}
      <header className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-amber-500/20 p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <Terminal className="w-6 h-6 text-amber-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-serif italic text-white tracking-tight">IronicRayquaza</h1>
              <p className="text-amber-500/50 text-[10px] font-mono uppercase tracking-[0.3em]">Metropolis Protocol v1.4</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Infrastructure</p>
              <p className="text-sm font-mono text-white">{repos.length} Repo Nodes</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">Active Uptime</p>
              <p className="text-sm font-mono text-white">99.98%</p>
            </div>
          </div>
        </motion.div>

        <div className="pointer-events-auto flex flex-col gap-3">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">Procedural Grid: Calibrated</span>
          </div>
        </div>
      </header>

      {/* Main Overlay Content */}
      <div className="flex justify-between items-end gap-10">
        {/* Repo Telemetry List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto w-72 max-h-[40vh] overflow-y-auto bg-black/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-3 shadow-2xl custom-scrollbar"
        >
          <div className="sticky top-0 bg-transparent backdrop-blur-md pt-2 pb-4 px-3 border-b border-white/5 mb-2">
            <h2 className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.2em]">Architecture Nodes</h2>
          </div>
          <div className="space-y-1">
            {repos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => setSelectedRepo(repo.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group ${
                  selectedRepo === repo.id 
                    ? 'bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex flex-col items-start gap-1 overflow-hidden">
                  <span className={`font-mono text-xs truncate ${selectedRepo === repo.id ? 'text-amber-400' : 'text-white/70 group-hover:text-white'}`}>
                    {repo.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span className="text-[9px] text-zinc-500 font-mono italic">{repo.language || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-mono text-white/40">{repo.commits}λ</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Node Detail Matrix */}
        <AnimatePresence>
          {selectedData && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto bg-black/80 backdrop-blur-3xl border border-amber-500/30 p-8 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] w-[26rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Box size={140} className="text-amber-500" strokeWidth={0.5} />
              </div>
              
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.4em] mb-2 block">Structural Analysis</span>
                <h3 className="text-3xl font-serif italic text-white mb-6 tracking-tight">{selectedData.name}</h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <TelemetryCard label="Commit Density" value={`${selectedData.commits} Units`} subValue="Height Scale" />
                  <TelemetryCard label="Structural Stargazers" value={selectedData.stars} subValue="Width Scale" />
                </div>
                
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl mb-8">
                   <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                     {selectedData.description || "Experimental neural construct representing public repository lattice. No high-level manifest provided."}
                   </p>
                </div>

                <a 
                  href={`https://github.com/${selectedData.fullName}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-4 bg-amber-500 text-black rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                >
                  Enter Repository <Terminal size={14} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TelemetryCard({ label, value, subValue }: { label: string, value: string | number, subValue: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-[9px] text-amber-500/50 uppercase tracking-widest mb-3 font-mono">{label}</p>
      <div className="flex flex-col gap-1">
        <span className="text-xl font-mono font-bold text-white">{value}</span>
        <span className="text-[9px] text-zinc-500 font-mono italic">{subValue}</span>
      </div>
    </div>
  );
}
