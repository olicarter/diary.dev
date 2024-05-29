import CreateFeedbackForm from '../CreateFeedbackForm'
import { createFeedback } from '../actions'

export default async function CreateFeedbackPage() {
  return <CreateFeedbackForm action={createFeedback} />
}
