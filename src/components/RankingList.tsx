"use client"

import React, { useMemo } from 'react'
import { Star } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Player = {
  id: number
  name: string
  wins: number
  losses: number
  avatar: string
}

export default function RankingList() {
  const currentUser = "Jack Sparrow"

  const dummyRankings: Player[] = [
    { id: 1, name: "Admiral Ackbar", wins: 15, losses: 3, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Admiral" },
    { id: 2, name: "Captain Nemo", wins: 12, losses: 5, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Nemo" },
    { id: 3, name: "Sailor Moon", wins: 10, losses: 7, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Moon" },
    { id: 4, name: "Popeye", wins: 8, losses: 9, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Popeye" },
    { id: 5, name: "Jack Sparrow", wins: 7, losses: 10, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Sparrow" },
    { id: 6, name: "Moby Dick", wins: 5, losses: 12, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Moby" },
    { id: 7, name: "Aquaman", wins: 3, losses: 15, avatar: "https://api.dicebear.com/6.x/bottts/svg?seed=Aquaman" },
    ...Array.from({ length: 13 }, (_, i) => ({
      id: i + 8,
      name: `Player ${i + 8}`,
      wins: Math.floor(Math.random() * 20),
      losses: Math.floor(Math.random() * 20),
      avatar: `https://api.dicebear.com/6.x/bottts/svg?seed=${i + 8}`
    }))
  ]

  const calculatePoints = (wins: number, losses: number) => {
    return wins * 3 - losses
  }

  const sortedPlayers = useMemo(() => {
    return [...dummyRankings].sort((a, b) => {
      const pointsA = calculatePoints(a.wins, a.losses)
      const pointsB = calculatePoints(b.wins, b.losses)
      return pointsB - pointsA
    }).slice(0, 20)
  }, [])

  const currentUserData = dummyRankings.find(player => player.name === currentUser)
  const currentUserRank = sortedPlayers.findIndex(player => player.name === currentUser) + 1
  const currentUserPoints = currentUserData ? calculatePoints(currentUserData.wins, currentUserData.losses) : 0
  const winRate = currentUserData ? (currentUserData.wins / (currentUserData.wins + currentUserData.losses)) * 100 : 0

  return (
    <ScrollArea className="w-full h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center justify-start bg-[#FBF7EF] pb-28 px-1 pt-4">
        <div className="w-full max-w-[368px] mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-sm font-semibold opacity-75">Your Current Rank</h2>
              <div className="text-3xl font-bold">{currentUserRank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Total Points</div>
              <div className="text-2xl font-semibold">{currentUserPoints}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <div>Wins: {currentUserData?.wins}</div>
            <div>Losses: {currentUserData?.losses}</div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
            <div 
              className="bg-yellow-400 h-2 rounded-full" 
              style={{ width: `${winRate}%` }}
            ></div>
          </div>
          <div className="text-xs text-right">
            Win Rate: {winRate.toFixed(1)}%
          </div>
        </div>
        <div className="w-full max-w-[368px]">
          {sortedPlayers.map((player, index) => {
            const points = calculatePoints(player.wins, player.losses)
            const isCurrentUser = player.name === currentUser
            return (
              <div 
                key={player.id} 
                className={cn(
                  "flex items-center justify-between py-3 px-3 border-b border-gray-200 last:border-b-0 transition-colors",
                  isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs",
                    index === 0 ? 'bg-yellow-500 text-white' : 
                    index === 1 ? 'bg-gray-400 text-white' : 
                    index === 2 ? 'bg-amber-600 text-white' : 
                    'bg-gray-100 text-gray-600',
                    "mr-3"
                  )}>
                    {index + 1}
                  </div>
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{player.name}</div>
                    <div className="text-xs text-gray-500">
                      {player.wins}W - {player.losses}L
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="font-medium text-sm">{points} pts</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}