import { NextResponse } from 'next/server'
// The client you created in Step 3
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Create/Update Profile in public.profiles
      const { user } = data
      
      await supabase.from('profiles').upsert({
        user_id: user.id,
        username: user.user_metadata.user_name || user.email?.split('@')[0],
        full_name: user.user_metadata.full_name || user.user_metadata.name,
        avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
        github_username: user.app_metadata.provider === 'github' ? user.user_metadata.user_name : null,
        github_id: user.app_metadata.provider === 'github' ? user.user_metadata.provider_id : null,
        email_verified: true,
      }, { onConflict: 'user_id' })

      // Log activity
      await supabase.from('audit_log').insert({
        user_id: user.id,
        event_type: 'login',
        event_category: 'auth',
        metadata: { provider: user.app_metadata.provider }
      })

      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be more lenient in dev
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
