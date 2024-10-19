"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getLeaderboard, getMyLeaderboard } from '@/utils/api'

type Player = {
  id: string
  highestPoints: string
  username: string
  wonCount: number
  lostCount: number
  image: string
}

interface RankingListProps { }
const RankingList: React.FC<RankingListProps> = () => {

  const [leaderboardData, setLeaderboardData] = useState([] as Player[])
  const [currentUserData, setCurrentUserData] = useState({} as any)
  const [user, setUser] = useState({} as any);



  const getLeaderboardData = async () => {
    try {
      const leaderboard = await getLeaderboard();
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
    }
  }

  const getCurrentUserData = async () => {
    try {
      const cUserData = await getMyLeaderboard();
      setCurrentUserData(cUserData);
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
    }
  }

  useEffect(() => {
    const userString = localStorage.getItem('user')
    const user = userString ? JSON.parse(userString) : null
    setUser(user)

    if (leaderboardData.length === 0) {
      getLeaderboardData();
    }

    getCurrentUserData();

  }, []);


  console.log("leaderboardData", leaderboardData)
  const currentUser = user ? user?.username : ""
  console.log("currentUser", currentUser)

  for (const player of leaderboardData) {
    player.image = player.image ? player.image : `https://api.dicebear.com/6.x/bottts/svg?seed=${player.username}`
  }

  return (
    <ScrollArea className="w-full h-[calc(100vh-64px)]">
      {leaderboardData.length > 0 ? (
        <div className="flex flex-col items-center justify-start pb-28 px-1 pt-4">
          {currentUserData ? (
            <div className="w-full max-w-[368px] mb-6 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-sm font-semibold opacity-75">Your Current Rank</h2>
                  <div className="text-3xl font-bold">{currentUserData.rank}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-75">Total Points</div>
                  <div className="text-2xl font-semibold">{currentUserData.highestPoints}</div>
                </div>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <div>wonCount: {currentUserData?.wonCount}</div>
                <div>lostCount: {currentUserData?.lostCount}</div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${currentUserData.winrate}%` }}
                ></div>
              </div>
              <div className="text-xs text-right">
                Win Rate: {currentUserData?.winrate?.toFixed(1)}%
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[368px]">
              <p className="text-sm mb-3 opacity-90">
                Loading your data...
              </p>
            </div>
          )}
          {leaderboardData && leaderboardData.length > 0 ? (
            <div className="w-full max-w-[368px]">
              {leaderboardData.map((player, index) => {
                const isCurrentUser = player.username === currentUser
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
                        <AvatarImage src={player.image} alt={player.username} />
                        <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{player.username}</div>
                        <div className="text-xs text-gray-500">
                          {player.wonCount}W - {player.lostCount}L
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="font-medium text-sm">{player.highestPoints} pts</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full max-w-[368px] text-center text-gray-500">
              No players yet
            </div>
          )}

        </div>
      ) : (
        <div className="w-full max-w-[368px] text-center text-gray-500">
          Loading leaderboard...
        </div>
      )}
    </ScrollArea>
  )
}

export default RankingList;
