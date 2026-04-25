import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch installations for this user
  const { data: installations } = await supabase
    .from('github_installations')
    .select('installation_id, account_login')
    .eq('user_id', user.id);

  const installationIds = installations?.map(i => i.installation_id) || [];

  // Fetch telemetry counts
  const { count: fixesCount } = await supabase
    .from('auto_fixes')
    .select('*', { count: 'exact', head: true })
    .in('installation_id', installationIds);

  const { count: narrationsCount } = await supabase
    .from('narrations')
    .select('*', { count: 'exact', head: true })
    .in('installation_id', installationIds);

  // Fetch latest activity
  const { data: recentFixes } = await supabase
    .from('auto_fixes')
    .select('*')
    .in('installation_id', installationIds)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] relative overflow-hidden flex flex-col selection:bg-[#ffb84d]/30 selection:text-[#ffb84d]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src="/treya-gradient.jpg" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" />
         <div className="absolute inset-0 bg-gradient-to-b from-[#131314] via-transparent to-[#131314]"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-50 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="text-2xl text-[#ffb84d] font-serif italic tracking-tight">
            Aethelgard
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-label-md text-white">{profile?.full_name || user.email}</span>
              <span className="text-[10px] font-label-sm text-amber-500/50 uppercase tracking-widest">{profile?.subscription_tier || 'HOBBY'} OPERATOR</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#ffb84d]/30 overflow-hidden bg-zinc-900">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-[#ffb84d]">
                   <span className="material-symbols-outlined">person</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl group hover:border-[#ffb84d]/20 transition-all duration-500">
              <h1 className="text-4xl font-serif text-white mb-4">Neural Link Active</h1>
              <p className="text-[#d6c4b0] opacity-60 leading-relaxed max-w-xl">
                System telemetry is streaming. All autonomous sub-processes are operating within expected parameters. 
                Your workspace is synchronized with the latest repository state.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 { label: 'Autonomous Fixes', value: fixesCount || 0, icon: 'bolt', color: 'text-amber-400' },
                 { label: 'Neural Narrations', value: narrationsCount || 0, icon: 'psychology', color: 'text-emerald-400' },
                 { label: 'Active Links', value: installations?.length || 0, icon: 'hub', color: 'text-blue-400' },
                 { label: 'Security Status', value: 'E2EE', icon: 'lock', color: 'text-zinc-400' },
               ].map((stat, i) => (
                 <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                   <div className="flex items-center justify-between mb-2">
                     <span className={`material-symbols-outlined ${stat.color} text-[20px]`}>{stat.icon}</span>
                     <span className="text-[10px] font-label-sm text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                   </div>
                   <div className="text-3xl font-serif text-white">{stat.value}</div>
                 </div>
               ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-12 space-y-6">
              <h2 className="text-sm font-label-sm text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">Recent Intelligence</h2>
              <div className="space-y-4">
                {recentFixes && recentFixes.length > 0 ? (
                  recentFixes.map((fix: any, i) => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-amber-500 text-[20px]">construction</span>
                        </div>
                        <div>
                          <h3 className="text-sm text-white font-serif">{fix.repo_name}</h3>
                          <p className="text-[11px] text-[#d6c4b0] opacity-50">{fix.summary || 'Autonomous repair completed.'}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600">
                        {new Date(fix.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-[11px] font-label-sm text-zinc-600 uppercase tracking-widest">No recent telemetry found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Profile Card */}
          <div className="space-y-6">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-xl">
              <h3 className="text-sm font-label-sm text-amber-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Operator Identity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Email</span>
                  <span className="text-white font-mono text-[12px]">{user.email}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Provider</span>
                  <span className="text-white uppercase text-[12px] tracking-widest">{user.app_metadata.provider}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Created</span>
                  <span className="text-white text-[12px]">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <form action="/auth/signout" method="post" className="mt-8">
                <button className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] font-label-sm uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all">
                  Terminate Session
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
}
