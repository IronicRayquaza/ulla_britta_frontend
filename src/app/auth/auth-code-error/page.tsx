import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
      </div>
      <h1 className="text-3xl font-serif text-white mb-2">Authentication Failed</h1>
      <p className="text-[#d6c4b0] opacity-60 max-w-md mb-8">
        The neural link could not be established. This might be due to an expired token, 
        incorrect credentials, or a disruption in the transmission lattice.
      </p>
      <Link 
        href="/auth/login" 
        className="px-8 py-3 bg-[#ffb84d] text-[#452b00] rounded-xl font-label-md text-[11px] uppercase tracking-widest font-bold hover:shadow-[0_0_20px_rgba(255,184,77,0.3)] transition-all"
      >
        Retry Initialization
      </Link>
    </div>
  );
}
