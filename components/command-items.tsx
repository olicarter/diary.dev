'use client'

import {
  RefObject,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
} from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { CommandItem } from '@/components/ui/command'
import { Plus } from 'lucide-react'
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CreateFeedbackForm from '@/app/feedback/CreateFeedbackForm'
import { createFeedback } from '@/app/feedback/actions'
import { createPost } from '@/app/posts/actions'
import CreatePostForm from '@/app/posts/create/CreatePostForm'

interface DialogCommandItemProps {
  inputRef: RefObject<HTMLInputElement>
}

export function CreateFeedback(props: DialogCommandItemProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) props.inputRef.current?.focus()
  }, [open, props.inputRef.current])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <CommandItem icon={Plus} onSelect={() => setOpen(true)}>
          Create Feedback
        </CommandItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          onKeyDown={e => {
            if (e.key !== 'Escape') e.stopPropagation()
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Feedback</DialogTitle>
            <DialogDescription>
              Eaque doloribus officiis provident magni nam et.
            </DialogDescription>
          </DialogHeader>
          <CreateFeedbackForm
            action={async formData => {
              await createFeedback(formData)
              setOpen(false)
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
export function CreatePost(props: DialogCommandItemProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) props.inputRef.current?.focus()
  }, [open, props.inputRef.current])

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <CommandItem icon={Plus} onSelect={() => setOpen(true)}>
          Create Post
        </CommandItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          onKeyDown={e => {
            if (e.key !== 'Escape') e.stopPropagation()
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Eaque doloribus officiis provident magni nam et.
            </DialogDescription>
          </DialogHeader>
          <CreatePostForm
            action={async formData => {
              await createPost(formData)
              setOpen(false)
            }}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

interface SignInWithProps extends ComponentPropsWithoutRef<typeof CommandItem> {
  setLoading: (loading: boolean) => void
}

export function SignInWithGithub({
  children = 'Sign In with Github',
  setLoading,
  ...props
}: SignInWithProps) {
  const supabase = createClient()
  const router = useRouter()

  const signIn = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    })
    if (data.url) router.push(data.url)
    if (error) router.push('/login?message=Could not authenticate user')
  }

  return (
    <CommandItem icon={SiGithub} onSelect={signIn} {...props}>
      {children}
    </CommandItem>
  )
}

export function SignInWithGoogle({
  children = 'Sign In with Google',
  setLoading,
  ...props
}: SignInWithProps) {
  const supabase = createClient()
  const router = useRouter()

  const signIn = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/auth/callback`
          : 'http://localhost:3000/auth/callback',
      },
    })
    if (data.url) router.push(data.url)
    if (error) router.push('/login?message=Could not authenticate user')
  }

  return (
    <CommandItem icon={SiGoogle} onSelect={signIn} {...props}>
      {children}
    </CommandItem>
  )
}
