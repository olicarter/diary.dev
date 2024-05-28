import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { type PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { CommandMenuDialog } from '@/components/command-menu'
import { createClient } from '@/utils/supabase/server'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'diary.dev',
  description: "the developer's diary",
}

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: PropsWithChildren) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html
      lang="en"
      className={cn(
        'bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white',
        inter.className,
      )}
    >
      <body>
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex flex-col w-full min-h-svh">
            <div className="flex grow justify-center w-full">
              <div className="space-y-8 max-w-lg w-full">{children}</div>
            </div>
          </div>
        </main>
        <CommandMenuDialog user={user} />
      </body>
    </html>
  )
}
