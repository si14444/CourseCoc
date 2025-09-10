'use client'

import NoSSR from '@/components/ui/NoSSR'
import MainPage from '@/components/MainPage'

export default function Home() {
  return (
    <NoSSR>
      <MainPage />
    </NoSSR>
  )
}
