import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) return null

  const signIn = async () => {
    'use server'

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    })

    if (data.url) {
      redirect(data.url)
    }

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/protected')
  }

  return (
    <form action={signIn}>
      <button>Continue with Github</button>
    </form>
  )
}
