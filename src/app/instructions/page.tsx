"use client"

import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function InstructionsPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FBF7EF] pb-28 px-4 pt-8">
      <h1 className="text-3xl font-bold mb-6">How to Play BattleFold</h1>
      <ScrollArea className="w-full max-w-2xl h-[calc(100vh-200px)] px-4">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Setup</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Game is played on an 8x8 grid</li>
              <li>You and the enemy each have 5 ships</li>
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
        </div>
      </ScrollArea>
    </div>
  )
}