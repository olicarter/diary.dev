import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { type PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { CommandMenu } from '@/components/command-menu'
import { createClient } from '@/utils/supabase/server'
import Path from '@/app/Path'

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
      <body className="grid grid-cols-[320px_1fr] xl:grid-cols-[320px_1fr_320px]">
        <aside className="border-r dark:border-white/20">
          <CommandMenu user={user} />
        </aside>
        <main className="min-h-screen flex flex-col">
          <header className="border-b border-black/20 dark:border-white/20 flex h-12 items-center px-4">
            <Path />
          </header>
          <div className="p-4 space-y-4 w-full">{children}</div>
        </main>
        <aside className="border-l dark:border-white/20 hidden xl:flex">
          <div className="h-12 border-b border-black/20 dark:border-white/20 w-full" />
        </aside>
      </body>
    </html>
  )
}
