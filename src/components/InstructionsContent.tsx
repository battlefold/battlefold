"use client"

import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Timer, Zap, Star } from 'lucide-react'

export default function InstructionsContent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FBF7EF] pb-28 px-4 pt-8">
      <div className="w-full max-w-[368px]">
        <h1 className="text-3xl font-bold mb-6">How to Play BattleFold</h1>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Setup</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Game is played on an 6x6 grid</li>
                <li>You and the enemy each have 3 ships</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Gameplay</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Place your ships on the grid</li>
                <li>Take turns attacking each other's grid</li>
                <li>First to sink all enemy ships wins</li>
              </ol>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Cell Colors</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 mr-3 rounded-sm"></div>
                  <span>Hit enemy ship</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 mr-3 rounded-sm"></div>
                  <span>Enemy hit your ship</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-blue-300/30 mr-3 rounded-sm"></div>
                  <span>Your miss</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-red-300/30 mr-3 rounded-sm"></div>
                  <span>Enemy miss</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-black mr-3 rounded-sm"></div>
                  <span>Both missed same cell</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 mr-3 rounded-sm"></div>
                  <span>Both hit same cell</span>
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Points System</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Base Points</h3>
                  <ul className="list-disc list-inside">
                    <li>Hit: 20 points</li>
                    <li>Miss: 1 point</li>
                  </ul>
                </div>
                <div className="flex items-start space-x-3">
                  <Timer className="w-5 h-5 mt-1 flex-shrink-0 text-purple-500" />
                  <div>
                    <h3 className="text-md font-semibold">Round Multiplier</h3>
                    <p className="text-sm">Starts at 60x, decreases by 1 each round</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-500" />
                  <div>
                    <h3 className="text-md font-semibold">Streak Multiplier</h3>
                    <p className="text-sm">Increases by 1 for each consecutive hit, resets on miss</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 mt-1 flex-shrink-0 text-blue-500" />
                  <div>
                    <h3 className="text-md font-semibold">Final Score Calculation</h3>
                    <p className="text-sm">Points = Base Points × Round Multiplier × Streak Multiplier</p>
                    <p className="text-sm mt-2">Total Score = (Wins × 3) - Losses</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
