'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDebounce } from 'react-use'
import { createClient } from '@/utils/supabase/client'
// import { CommandLoading } from 'cmdk'

export default function UserCombobox(props: {
  name: string
  onChange?: (value: string) => void
  value?: string
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [search, setSearch] = useState('')
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useDebounce(
    () => {
      async function fetchUsers() {
        const { data } = await supabase
          .from('profiles')
          .select('id, avatar_url, full_name, username')
          .or(`full_name.ilike.%${search}%,username.ilike.%${search}%`)
          .order('full_name')
          .limit(10)
        if (data) setProfiles(data)
        setLoading(false)
      }
      fetchUsers()
    },
    300,
    [search],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="font-normal justify-between"
          role="combobox"
          variant="outline"
        >
          <input name={props.name} type="hidden" value={props.value ?? value} />
          {props.value ?? value
            ? profiles.find(profile => profile.id === (props.value ?? value))
                ?.full_name
            : 'Select user...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput
            onValueChange={e => {
              setLoading(true)
              setSearch(e)
            }}
            placeholder="Search users..."
            value={search}
          />
          {/* {loading && <CommandLoading>Fetching users...</CommandLoading>} */}
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {profiles.map(profile => (
                <CommandItem
                  key={profile.id}
                  keywords={[profile.full_name, profile.username]}
                  onSelect={currentValue => {
                    ;(props.onChange ?? setValue)(
                      currentValue === (props.value ?? value)
                        ? ''
                        : currentValue,
                    )
                    setOpen(false)
                  }}
                  value={profile.id}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === profile.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="flex grow items-center justify-between">
                    <span>
                      {profile.full_name}{' '}
                      <span className="opacity-50">@{profile.username}</span>
                    </span>
                    <Image
                      alt="Avatar"
                      className="rounded-full"
                      height={32}
                      src={profile.avatar_url}
                      width={32}
                    />
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
