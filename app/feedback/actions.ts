import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function createFeedback(formData: FormData) {
  'use server'
  const supabase = createClient()
  const { error } = await supabase.from('feedback').insert({
    content: formData.get('content'),
    recipient: formData.get('recipient'),
    visibility: formData.get('visibility'),
  })
  if (error) throw error
  redirect('/feedback')
}