import { createClient } from '@/utils/supabase/server'
import { format, formatISO, parseISO } from 'date-fns'

export default async function PostsPage() {
  const supabase = createClient()

  const { data } = await supabase
    .from('posts')
    .select('id, content, created_at')
    .order('created_at', { ascending: false })

  const postsGroupedByDay =
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
      {Object.entries(postsGroupedByDay).map(([day, posts]) => (
        <section className="space-y-4" key={day}>
          <h4>{format(parseISO(day), 'dd MMM')}</h4>
          <ul className="space-y-4">
            {posts.map(post => (
              <li key={post.id}>
                <p className="text-sm text-gray-500">
                  {format(parseISO(post.created_at), 'HH:mm')}
                </p>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </ul>
  )
}
