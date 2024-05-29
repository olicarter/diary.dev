'use client'

import { useSelectedLayoutSegments } from 'next/navigation'

export default function Path() {
  const segments = useSelectedLayoutSegments()

  return (
    <p className="font-bold font-mono">
      diary.dev{segments.length > 0 && `/${segments.join('/')}`}
    </p>
  )
}
