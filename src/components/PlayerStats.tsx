import React from 'react'
import { Timer, Zap, Swords, Cpu } from 'lucide-react'

interface PlayerStatsProps {
  roundMultiplier: number
  streakMultiplier: number
  playerPoints: number
  aiPoints: number
}

export default function PlayerStats({ roundMultiplier, streakMultiplier, playerPoints, aiPoints }: PlayerStatsProps) {
  return (
    <div className="w-full max-w-[300px] mb-2 flex justify-between items-start text-sm">
      <div className="flex flex-col items-start">
        <div className="text-xs text-gray-500 mb-1">Multipliers</div>
        <div className="flex items-center">
          <Timer className="w-4 h-4 mr-2 text-purple-500" />
          <div className="font-semibold">{roundMultiplier}x</div>
        </div>
        <div className="flex items-center mt-1">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          <div className="font-semibold">{streakMultiplier}x</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-500 mb-1">Points</div>
        <div className="flex items-center">
          <div className="font-semibold">{playerPoints}</div>
          <Swords className="w-4 h-4 ml-2 text-blue-500" />
        </div>
        <div className="flex items-center mt-1">
          <div className="font-semibold">{aiPoints}</div>
          <Cpu className="w-4 h-4 ml-2 text-red-500" />
        </div>
      </div>
    </div>
  )
}
