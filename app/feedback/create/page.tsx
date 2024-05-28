import CreateFeedbackForm from '../CreateFeedbackForm'
import { createFeedback } from '../actions'

export default async function CreateFeedbackPage() {
  return (
    <>
      <h3>New Feedback</h3>
      <CreateFeedbackForm action={createFeedback} />
    </>
  )
}
