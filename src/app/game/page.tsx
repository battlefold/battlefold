import React from 'react'
import BattleFold from '@/components/BattleFold'
import NavigationBar from '@/components/NavigationBar'

export default function GamePage() {
  return (
    <div className="w-full h-screen bg-white overflow-hidden relative">
      <div className="h-full overflow-y-auto pb-20">
        <BattleFold />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <NavigationBar />
      </div>
    </div>
  )
}