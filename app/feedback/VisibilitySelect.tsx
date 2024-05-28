import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function VisibilitySelect(props: { name: string }) {
  return (
    <Select defaultValue="private" name={props.name}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="private">
          Private <span className="opacity-50 text-sm">Only you</span>
        </SelectItem>
        <SelectItem value="recipient">
          Recipient{' '}
          <span className="opacity-50 text-sm">Only you and the recipient</span>
        </SelectItem>
        <SelectItem value="team">
          Team <span className="opacity-50 text-sm">Anyone in your team</span>
        </SelectItem>
        <SelectItem value="company">
          Company{' '}
          <span className="opacity-50 text-sm">Anyone in your company</span>
        </SelectItem>
        <SelectItem value="public">
          Public <span className="opacity-50 text-sm">Anyone and everyone</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
