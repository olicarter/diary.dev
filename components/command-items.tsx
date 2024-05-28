import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CommandItem } from '@/components/ui/command'
import { Github } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export function SignInWithGithub() {
  const supabase = createClient()
  const router = useRouter()

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    })
    if (data.url) router.push(data.url)
    if (error) {
      return router.push('/login?message=Could not authenticate user')
    }
  }

  return (
    <CommandItem icon={Github} onSelect={signInWithGithub}>
      Sign In with Github
    </CommandItem>
  )
}
