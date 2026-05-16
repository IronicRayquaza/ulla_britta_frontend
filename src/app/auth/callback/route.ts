import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const { user } = data
      
      // Update/Refine the profile created by the database trigger
      await supabase.from('profiles').upsert({
        user_id: user.id,
        username: user.user_metadata.user_name || user.user_metadata.preferred_username || user.email?.split('@')[0],
        full_name: user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
        github_username: user.app_metadata.provider === 'github' ? user.user_metadata.user_name : null,
        github_id: user.app_metadata.provider === 'github' ? user.user_metadata.provider_id : null,
        email_verified: true,
      }, { onConflict: 'user_id' })

      // Audit the login event
      await supabase.from('audit_log').insert({
        user_id: user.id,
        event_type: 'login',
        event_category: 'auth',
        metadata: { provider: user.app_metadata.provider, source: 'callback' }
      })

      // Intelligent Redirection
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle()

      const targetPath = profile?.onboarding_completed ? '/dashboard' : '/onboarding'
      
      return NextResponse.redirect(`${origin}${targetPath}`)
    }
  }

  // Redirect to error if exchange failed
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
