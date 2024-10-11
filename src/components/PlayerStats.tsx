import React from 'react'
import { Clock, Zap, Target, ShieldAlert } from 'lucide-react'

type PlayerStatsProps = {
  turnMultiplier: number
  streak: number
  playerPoints: number
  aiPoints: number
}

export default function PlayerStats({ turnMultiplier, streak, playerPoints, aiPoints }: PlayerStatsProps) {
  return (
    <div className="flex justify-between items-center w-full px-4 mb-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{turnMultiplier}x</span>
        </div>
        <div className="flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{1 + streak}x</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <Target className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-sm font-medium">{playerPoints}</span>
          </div>
          <span className="text-xs">Player</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <ShieldAlert className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm font-medium">{aiPoints}</span>
          </div>
          <span className="text-xs">Enemy</span>
        </div>
      </div>
    </div>
  )
}