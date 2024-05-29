import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createPost } from '../actions'

export default async function CreatePostPage() {
  return (
    <form action={createPost} className="flex flex-col gap-8 rounded w-full">
      <Textarea autoFocus name="content" />
      <Button>Post</Button>
    </form>
  )
}
