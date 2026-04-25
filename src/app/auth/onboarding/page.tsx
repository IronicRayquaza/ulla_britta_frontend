"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, CheckCircle2, ArrowRight, Mail, Send, MessageSquare } from 'lucide-react';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?next=/auth/onboarding');
        return;
      }
      setUser(user);

      // If we landed here with an installation_id, automatically move to step 2 or process it
      const installationId = searchParams.get('installation_id');
      if (installationId) {
        handleLinkGitHub(installationId);
      }
    };
    fetchUser();
  }, [searchParams]);

  const handleLinkGitHub = async (id?: string) => {
    if (!id) {
       // Redirect to GitHub App installation
       // Replace with your actual GitHub App installation URL
       window.location.href = `https://github.com/apps/ulla-britta-ai/installations/new`;
       return;
    }

    setIsLoading(true);
    try {
      await supabase.from('github_installations').upsert({
        user_id: user.id,
        installation_id: parseInt(id),
        status: 'active',
        account_login: user.user_metadata.user_name || 'operator',
        account_type: 'User'
      });
      setStep(2);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    await supabase.from('profiles').update({ onboarding_completed: true }).eq('user_id', user.id);
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] relative overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 z-0 opacity-20">
         <img src="/treya-gradient.jpg" alt="bg" className="absolute inset-0 w-full h-full object-cover mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 max-w-xs mx-auto">
           {[1, 2].map((s) => (
             <div key={s} className={`h-1 flex-grow rounded-full transition-all duration-500 ${step >= s ? 'bg-[#ffb84d]' : 'bg-white/10'}`} />
           ))}
        </div>

        <div className="p-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {step === 1 ? (
            <div className="space-y-8 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-16 h-16 bg-[#ffb84d]/10 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-8 h-8 text-[#ffb84d] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-serif text-white">Connect GitHub</h1>
                <p className="text-[#d6c4b0] opacity-60 font-body-md max-w-sm mx-auto">
                  To begin monitoring your repositories, you must establish a neural link with our GitHub application.
                </p>
              </div>

              <div className="pt-4">
                 <button 
                   onClick={() => handleLinkGitHub()}
                   disabled={isLoading}
                   className="group w-full py-4 bg-white text-black rounded-xl font-label-md text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#ffb84d] transition-all flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 className="animate-spin" /> : "Install GitHub App"}
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button onClick={() => setStep(2)} className="mt-4 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">Skip for now</button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-serif text-white">Secondary Channels</h1>
                <p className="text-[#d6c4b0] opacity-60 font-body-md">
                  Establish priority communication lines for telemetry and alerts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[
                   { name: 'Email', icon: <Mail size={20} />, color: 'bg-blue-500/10 text-blue-400' },
                   { name: 'Discord', icon: <MessageSquare size={20} />, color: 'bg-indigo-500/10 text-indigo-400' },
                   { name: 'Telegram', icon: <Send size={20} />, color: 'bg-sky-500/10 text-sky-400' },
                 ].map((channel) => (
                   <div key={channel.name} className="p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#ffb84d]/30 transition-all cursor-pointer group">
                      <div className={`w-10 h-10 ${channel.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {channel.icon}
                      </div>
                      <h3 className="text-white text-sm font-label-sm uppercase tracking-wider">{channel.name}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Configure Link</p>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                 <button 
                   onClick={handleCompleteOnboarding}
                   disabled={isLoading}
                   className="group w-full py-4 bg-[#ffb84d] text-[#452b00] rounded-xl font-label-md text-[11px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_30px_rgba(255,184,77,0.3)] transition-all flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 className="animate-spin" /> : "Initialize Console"}
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#131314] flex items-center justify-center"><Loader2 className="text-[#ffb84d] animate-spin" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
