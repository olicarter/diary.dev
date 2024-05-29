export default async function Index() {
  return (
    <div className="space-y-4">
      <section className="space-y-4">
        <p>
          <q>Like a diary, but useful</q> - <span>Someone, probably</span>
        </p>
        <p className="text-indigo-600 dark:text-indigo-400">
          Press{' '}
          <span className="bg-white dark:bg-black border border-indigo-600 dark:border-indigo-400 px-1 py-0.5 rounded">
            ⌘K
          </span>{' '}
          to get started
        </p>
      </section>
      <section>
        <h5 className="font-bold">diarize any way you like</h5>
        <p>
          Whether it's an end-of-day summary, mid-meeting idea, or feedback for
          a colleague, just get your thoughts down and we'll organize it into
          something useful.
        </p>
      </section>
      <section>
        <h5 className="font-bold">know everything, remember nothing</h5>
        <p>
          Use AI to easily query anything you've written, for use in standups,
          retros, 121s, job applications, whatever you like.
        </p>
      </section>
      <section>
        <h5 className="font-bold">share, or not</h5>
        <p>
          Private by default, you can choose to share specific entries with
          peers, teams, companies, or the world. Use it solo or create a
          hyper-transparent team culture, we love both.
        </p>
      </section>
    </div>
  )
}
