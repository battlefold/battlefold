'use client';

import React, { useState } from 'react'
import BattleFold from '@/components/BattleFold'
import TelegramAuth from '@/components/TelegramAuth'

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null)

  const handleUserAuthenticated = (name: string) => {
    setUserName(name)
  }

  return (
    <div>
      <TelegramAuth onUserAuthenticated={handleUserAuthenticated} />
      <BattleFold userName={userName} />
    </div>
  )
}
