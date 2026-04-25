import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
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

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] px-8 py-12 selection:bg-[#ffb84d]/30 selection:text-[#ffb84d]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-white mb-2">Protocol Settings</h1>
          <p className="text-[#d6c4b0] opacity-60">Manage your neural link and transmission parameters.</p>
        </header>

        <div className="space-y-12">
          {/* Profile Section */}
          <section>
            <h2 className="text-sm font-label-sm text-amber-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Operational Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-2xl border border-white/5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-label-sm text-zinc-500 uppercase tracking-widest mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={profile?.full_name || ''} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffb84d]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-sm text-zinc-500 uppercase tracking-widest mb-1">Username</label>
                  <input 
                    type="text" 
                    defaultValue={profile?.username || ''} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffb84d]/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                 <div className="w-24 h-24 rounded-full border-2 border-[#ffb84d]/20 overflow-hidden bg-zinc-900 mb-4">
                   <img src={profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aethelgard'} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <button className="text-[10px] font-label-sm text-amber-500 uppercase tracking-widest hover:text-[#ffb84d] transition-colors">Change Avatar</button>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <h2 className="text-sm font-label-sm text-amber-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Transmission Channels</h2>
            <div className="bg-white/[0.02] p-8 rounded-2xl border border-white/5 space-y-6">
              {[
                { name: 'Email Notifications', desc: 'Detailed intelligence reports via SMTP', enabled: prefs?.email_enabled },
                { name: 'Discord Webhook', desc: 'Real-time telemetry streams to your guild', enabled: prefs?.discord_enabled },
                { name: 'Telegram Alerts', desc: 'Mobile-first critical system updates', enabled: prefs?.telegram_enabled },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div>
                    <h3 className="text-sm text-white font-serif">{item.name}</h3>
                    <p className="text-[11px] text-[#d6c4b0] opacity-50">{item.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-all duration-300 relative ${item.enabled ? 'bg-[#ffb84d]' : 'bg-zinc-800'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-12 pt-8 border-t border-white/5 flex justify-end gap-4">
           <button className="px-8 py-3 bg-zinc-800 text-white rounded-xl text-[11px] font-label-sm uppercase tracking-widest hover:bg-zinc-700 transition-all">Cancel</button>
           <button className="px-8 py-3 bg-[#ffb84d] text-[#452b00] rounded-xl text-[11px] font-label-sm uppercase tracking-widest font-bold hover:shadow-[0_0_20px_rgba(255,184,77,0.3)] transition-all">Save Config</button>
        </footer>
      </div>
    </div>
  );
}
