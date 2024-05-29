'use client'

import Image from 'next/image'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSelectedLayoutSegment } from 'next/navigation'
import {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useRef,
  RefObject,
} from 'react'
import { type User } from '@supabase/supabase-js'
import {
  BookOpenCheck,
  Building2,
  HandCoins,
  GraduationCap,
  LogOut,
  MessageCircleHeart,
  NotebookPen,
  Share,
  Share2,
  LogIn,
  Sparkles,
  Check,
  Home,
} from 'lucide-react'
import * as CommandItems from '@/components/command-items'

interface CommandMenuProps {
  user: User | null
}

export function CommandMenu(props: CommandMenuProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [pages, setPages] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const page = pages[pages.length - 1]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const cmdK = e.key === 'k' && (e.metaKey || e.ctrlKey)
      const forwardSlash = e.key === '/'
      if (cmdK || forwardSlash) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    setSearch('')
  }, [page])

  return (
    <Command
      className="h-full"
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
    >
      <CommandInput
        autoFocus
        loading={loading}
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        ref={inputRef}
        value={search}
      />
      <CommandMenuList
        inputRef={inputRef}
        page={page}
        search={search}
        setLoading={setLoading}
        setPages={setPages}
        user={props.user}
      />
    </Command>
  )
}

interface CommandMenuListProps extends CommandMenuProps {
  inputRef: RefObject<HTMLInputElement>
  onOpenChange?: (open: boolean) => void
  page: string
  search: string
  setLoading: Dispatch<SetStateAction<boolean>>
  setPages: Dispatch<SetStateAction<string[]>>
}

function CommandMenuList(props: CommandMenuListProps) {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(props.user)

  async function fetchUser() {
    const response = await supabase.auth.getUser()
    setUser(response.data.user)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  function push(href: string) {
    router.push(href)
    props.setPages([])
    // onClose()
  }

  async function signOut() {
    props.setLoading(true)
    await supabase.auth.signOut()
    fetchUser()
    router.replace('/')
    props.setLoading(false)
    // onClose()
  }

  function appendPage(page: string) {
    props.setPages(prev => [...prev, page])
  }

  function hasIdentity(provider: string) {
    return user?.identities?.some(i => i.provider === provider)
  }

  const segment = useSelectedLayoutSegment()

  return (
    <CommandList className="max-h-full">
      {props.search !== '' && <CommandEmpty>No results found.</CommandEmpty>}
      {!props.page && (
        <>
          {user ? (
            <>
              {segment === 'feedback' && (
                <>
                  <CommandGroup heading="Feedback">
                    <CommandItems.CreateFeedback inputRef={props.inputRef} />
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              {segment === 'posts' && (
                <>
                  <CommandGroup heading="Posts">
                    <CommandItems.CreatePost inputRef={props.inputRef} />
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}
              <CommandGroup heading="Pages">
                <CommandItem icon={Home} onSelect={() => push('/timeline')}>
                  Timeline
                </CommandItem>
                <CommandItem
                  icon={MessageCircleHeart}
                  onSelect={() => push('/feedback')}
                >
                  Feedback
                </CommandItem>
                <CommandItem icon={NotebookPen} onSelect={() => push('/posts')}>
                  Posts
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem comingSoon icon={Sparkles}>
                  Query with AI
                </CommandItem>
                <CommandItem comingSoon icon={HandCoins}>
                  Find Work
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Connect">
                <CommandItem comingSoon icon={Building2}>
                  Join Team
                </CommandItem>
                <CommandItem comingSoon icon={Share}>
                  Share Profile
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          ) : (
            <>
              <CommandGroup>
                <CommandItems.SignInWithGithub setLoading={props.setLoading} />
                <CommandItems.SignInWithGoogle setLoading={props.setLoading} />
                <CommandItem
                  icon={LogIn}
                  onSelect={() => appendPage('sign-in')}
                >
                  Sign In with...
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          <CommandGroup heading="Learn">
            {user && (
              <CommandItem comingSoon icon={BookOpenCheck}>
                Complete Coding Challenges
              </CommandItem>
            )}
            <CommandItem comingSoon icon={GraduationCap}>
              What is diary.dev?
            </CommandItem>
          </CommandGroup>
          {user && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem comingSoon className="space-x-2">
                  <div className="border-[1.5px] border-black rounded-full size-4">
                    <Image
                      alt="Avatar"
                      className="rounded-full"
                      height={16}
                      src={user.user_metadata.avatar_url}
                      width={16}
                    />
                  </div>
                  <span>Edit Profile...</span>
                </CommandItem>
                <CommandItem
                  icon={Share2}
                  onSelect={() => appendPage('link-account')}
                >
                  Link Account...
                </CommandItem>
                <CommandItem icon={LogOut} onSelect={signOut}>
                  Sign Out
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </>
      )}
      {props.page === 'link-account' && (
        <CommandGroup heading="Link account...">
          <CommandItems.SignInWithGithub
            disabled={hasIdentity('github')}
            setLoading={props.setLoading}
          >
            <div className="flex items-center justify-between w-full">
              <span>Github</span>
              {hasIdentity('github') && <Check className="size-4" />}
            </div>
          </CommandItems.SignInWithGithub>
          <CommandItems.SignInWithGoogle
            disabled={hasIdentity('google')}
            setLoading={props.setLoading}
          >
            <div className="flex items-center justify-between w-full">
              <span>Google</span>
              {hasIdentity('google') && <Check className="size-4" />}
            </div>
          </CommandItems.SignInWithGoogle>
        </CommandGroup>
      )}
      {props.page === 'sign-in' && (
        <CommandGroup heading="Sign In with...">
          <CommandItems.SignInWithGithub setLoading={props.setLoading}>
            Github
          </CommandItems.SignInWithGithub>
          <CommandItems.SignInWithGoogle setLoading={props.setLoading}>
            Google
          </CommandItems.SignInWithGoogle>
        </CommandGroup>
      )}
    </CommandList>
  )
}
