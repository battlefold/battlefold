'use client';

import React, { useState } from 'react'
import BattleFold from '@/components/BattleFold'
import TelegramAuth from '@/components/TelegramAuth'

export default function HomeContent() {
  const [username, setUsername] = useState<string | null>(null);

  const handleUserAuthenticated = (name: string) => {
    setUsername(name);
  };

  return (
    <div>
      <TelegramAuth onUserAuthenticated={handleUserAuthenticated} />
      {username && <BattleFold username={username} />}
    </div>
  )
}
