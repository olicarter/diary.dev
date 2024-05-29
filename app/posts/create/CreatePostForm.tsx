'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

const minLength = 30

export default function CreatePostForm(props: {
  action: (formData: FormData) => Promise<void>
}) {
  const [content, setContent] = useState('')
  const [aiText] = useState('Waiting for input...')

  return (
    <form action={props.action} className="flex flex-col gap-4 rounded w-full">
      <div className="flex flex-col space-y-2">
        <Label className="flex justify-between">
          <span>Content</span>
          <span className="opacity-50">
            {content.length}/{minLength}
          </span>
        </Label>
        <Textarea
          autoFocus
          onChange={e => setContent(e.target.value)}
          minLength={minLength}
          name="content"
          required
          rows={4}
          value={content}
        />
        <div className="flex gap-1 text-indigo-600">
          <Sparkles className="m-0.5 shrink-0 size-4" />
          <span className="font-medium text-sm">{aiText}</span>
        </div>
      </div>
      <Button>Submit Post</Button>
    </form>
  )
}
