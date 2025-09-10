'use client'

import NoSSR from '@/components/ui/NoSSR'
import HomePage from '@/components/HomePage'

export default function Home() {
  return (
    <NoSSR>
      <HomePage />
    </NoSSR>
  )
}
