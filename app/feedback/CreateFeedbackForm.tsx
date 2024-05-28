'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import UserCombobox from './UserCombobox'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'
import { useDebounce } from 'react-use'
import { useState } from 'react'
import VisibilitySelect from './VisibilitySelect'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const minLength = 30

export default function CreateFeedbackForm(props: {
  action: (formData: FormData) => Promise<void>
}) {
  const [content, setContent] = useState('')
  const [aiText, setAIText] = useState('Waiting for input...')
  const [recipient, setRecipient] = useState('')

  // useDebounce(
  //   () => {
  //     if (content.length < 80) {
  //       setAIText('Writing more helps to give better feedback...')
  //     }
  //   },
  //   500,
  //   [content],
  // )

  return (
    <form action={props.action} className="flex flex-col gap-4 rounded w-full">
      <div className="flex flex-col space-y-2">
        <Label className="flex justify-between">
          <span>Feedback</span>
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
      <div className="flex flex-col space-y-2">
        <Label>Recipient</Label>
        <UserCombobox
          name="recipient"
          onChange={setRecipient}
          value={recipient}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Visibility</Label>
        <VisibilitySelect name="visibility" />
      </div>
      <Button>Submit Feedback</Button>
    </form>
  )
}
