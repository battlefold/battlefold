'use client';

import React, { useState } from 'react'
import BattleFold from '@/components/BattleFold'
import NavigationBar from '@/components/NavigationBar'
import TelegramAuth from '@/components/TelegramAuth'

export default function GamePage() {
  const [userName, setUserName] = useState<string | null>(null)

  const handleUserAuthenticated = (name: string) => {
    setUserName(name)
  }

  return (
    <div className="w-full h-screen bg-white overflow-hidden relative">
      <div className="h-full overflow-y-auto pb-20">
        <TelegramAuth onUserAuthenticated={handleUserAuthenticated} />
        <BattleFold userName={userName} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <NavigationBar />
      </div>
    </div>
  )
}
