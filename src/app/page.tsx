import React from 'react'
import BattleFold from '@/components/BattleFold'
import TelegramAuth from '@/components/TelegramAuth'

export default function Home() {
  return (
    <div>
      <TelegramAuth />
      <BattleFold />
    </div>
  )
}
