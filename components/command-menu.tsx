'use client'

import Image from 'next/image'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { type User } from '@supabase/supabase-js'
import {
  BookOpenCheck,
  Building2,
  HandCoins,
  GraduationCap,
  LogOut,
  MessageCircleHeart,
  NotebookPen,
  Plus,
  Share,
  Share2,
  LogIn,
  Sparkles,
  UserSearch,
  Eye,
} from 'lucide-react'
import * as CommandItems from './command-items'

interface CommandMenuProps {
  user: User | null
}

export function CommandMenu(props: CommandMenuProps) {
  const [pages, setPages] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const page = pages[pages.length - 1]

  return (
    <Command
      className="border-[1.5px] border-black/20"
      onKeyDown={e => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
          e.preventDefault()
          setPages(pages => pages.slice(0, -1))
        }
      }}
    >
      <CommandInput
        autoFocus
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        value={search}
      />
      <CommandMenuList {...props} page={page} setPages={setPages} />
    </Command>
  )
}

export function CommandMenuDialog(props: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const page = pages[pages.length - 1]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog
      onKeyDown={e => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (
          page &&
          (e.key === 'Escape' || (e.key === 'Backspace' && !search))
        ) {
          e.preventDefault()
          setPages(pages => pages.slice(0, -1))
        }
      }}
      open={open}
      onOpenChange={v => {
        setOpen(v)
        if (v === false) {
          setPages([])
          setSearch('')
        }
      }}
    >
      <CommandInput
        autoFocus
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        value={search}
      />
      <CommandMenuList
        {...props}
        onOpenChange={setOpen}
        page={page}
        setPages={setPages}
      />
    </CommandDialog>
  )
}

interface CommandMenuListProps extends CommandMenuProps {
  onOpenChange?: (open: boolean) => void
  page: string
  setPages: Dispatch<SetStateAction<string[]>>
}

function CommandMenuList(props: CommandMenuListProps) {
  const supabase = createClient()
  const router = useRouter()

  const onClose = () => props.onOpenChange?.(false)

  const push = (href: string) => {
    router.push(href)
    props.setPages([])
    onClose()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    onClose()
  }

  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      {!props.page && (
        <>
          {props.user ? (
            <>
              <CommandGroup>
                <CommandItem
                  icon={Plus}
                  onSelect={() => props.setPages(prev => [...prev, 'create'])}
                >
                  Create...
                </CommandItem>
                <CommandItem
                  icon={Eye}
                  onSelect={() => props.setPages(prev => [...prev, 'view'])}
                >
                  View...
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem icon={Sparkles}>Query with AI</CommandItem>
                <CommandItem icon={HandCoins}>Find Work</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Connect">
                <CommandItem icon={UserSearch}>Find Colleague</CommandItem>
                <CommandItem icon={Building2}>Join Team</CommandItem>
                <CommandItem icon={Share}>Share Profile</CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          ) : (
            <>
              <CommandGroup>
                <CommandItems.SignInWithGithub />
                <CommandItem
                  icon={LogIn}
                  onSelect={() => props.setPages(prev => [...prev, 'sign-in'])}
                >
                  Sign In with...
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          <CommandGroup heading="Learn">
            {props.user && (
              <CommandItem icon={BookOpenCheck}>
                Complete Coding Challenges
              </CommandItem>
            )}
            <CommandItem icon={GraduationCap}>What is diary.dev?</CommandItem>
          </CommandGroup>
          {props.user && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem className="space-x-2">
                  <div className="border-[1.5px] border-black rounded-full size-4">
                    <Image
                      alt="Avatar"
                      className="rounded-full"
                      height={16}
                      src={props.user.user_metadata.avatar_url}
                      width={16}
                    />
                  </div>
                  <span>Edit Profile...</span>
                </CommandItem>
                <CommandItem icon={Share2} onSelect={signOut}>
                  Connect Account...
                </CommandItem>
                <CommandItem icon={LogOut} onSelect={signOut}>
                  Sign Out
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </>
      )}
      {props.page === 'create' && (
        <CommandGroup>
          <CommandItem
            icon={NotebookPen}
            onSelect={() => push('/posts/create')}
          >
            Create Post
          </CommandItem>
          <CommandItem
            icon={MessageCircleHeart}
            onSelect={() => push('/feedback/create')}
          >
            Submit Feedback
          </CommandItem>
        </CommandGroup>
      )}
      {props.page === 'sign-in' && (
        <CommandGroup>
          <CommandItems.SignInWithGithub />
        </CommandGroup>
      )}
      {props.page === 'view' && (
        <CommandGroup>
          <CommandItem onSelect={() => push('/posts')}>
            View My Posts
          </CommandItem>
          <CommandItem onSelect={() => push('/feedback')}>
            View Submitted Feedback
          </CommandItem>
          <CommandItem onSelect={() => push('/feedback')}>
            View Received Feedback
          </CommandItem>
        </CommandGroup>
      )}
    </CommandList>
  )
}
