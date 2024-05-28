import { createClient } from '@/utils/supabase/server'
import { format, formatISO, intlFormatDistance, parseISO } from 'date-fns'

export default async function FeedbackPage() {
  const supabase = createClient()

  const { data } = await supabase
    .from('feedback')
    .select(
      'id, content, created_at, recipient(avatar_url, full_name, username)',
    )
    .order('created_at', { ascending: false })

  const feedbackGroupedByDay =
    data?.reduce((acc, post) => {
      const date = formatISO(parseISO(post.created_at), {
        representation: 'date',
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(post)
      return acc
    }, {} as Record<string, any[]>) ?? {}

  return (
    <ul className="space-y-8">
      {Object.entries(feedbackGroupedByDay).map(([day, feedbackList]) => (
        <section className="space-y-4">
          <h4>{format(parseISO(day), 'dd MMM')}</h4>
          <ul className="space-y-4">
            {feedbackList.map(feedback => (
              <li key={feedback.id}>
                <p>{feedback.content}</p>
                <p className="flex gap-1 items-center text-xs text-black/50">
                  Submitted{' '}
                  {intlFormatDistance(
                    parseISO(feedback.created_at),
                    new Date(),
                  )}{' '}
                  {feedback.recipient && (
                    <>
                      for{' '}
                      <a className="hover:text-blue-600" href="">
                        {feedback.recipient.username}
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ul>
  )
}
