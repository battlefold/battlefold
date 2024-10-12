"use client"

import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Target, Check, Star, Trophy, Zap, Users, Award, Swords } from 'lucide-react'

interface Quest {
  id: number
  title: string
  description: string
  points: number
  completed: boolean
  icon: React.ReactNode
  category: 'in-game' | 'social' | 'achievement'
}

const initialQuests: Quest[] = [
  { id: 1, title: "First Victory", description: "Win your first game", points: 100, completed: false, icon: <Trophy className="w-5 h-5 text-yellow-500" />, category: 'in-game' },
  { id: 2, title: "Sharpshooter", description: "Hit 5 ships in a single game", points: 200, completed: false, icon: <Target className="w-5 h-5 text-red-500" />, category: 'in-game' },
  { id: 3, title: "Strategist", description: "Win a game without losing any ships", points: 500, completed: false, icon: <Zap className="w-5 h-5 text-blue-500" />, category: 'in-game' },
  { id: 4, title: "Social Butterfly", description: "Add 5 friends", points: 150, completed: false, icon: <Users className="w-5 h-5 text-green-500" />, category: 'social' },
  { id: 5, title: "Unbeatable", description: "Win 5 games in a row", points: 1000, completed: false, icon: <Trophy className="w-5 h-5 text-purple-500" />, category: 'achievement' },
  { id: 6, title: "Veteran", description: "Play 50 games", points: 300, completed: false, icon: <Award className="w-5 h-5 text-indigo-500" />, category: 'achievement' },
]

const categoryIcons = {
  'all': <Swords className="w-4 h-4" />,
  'in-game': <Target className="w-4 h-4" />,
  'social': <Users className="w-4 h-4" />,
  'achievement': <Trophy className="w-4 h-4" />
}

export default function QuestsContent() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests)
  const [activeCategory, setActiveCategory] = useState<'all' | 'in-game' | 'social' | 'achievement'>('all')

  const handleClaimPoints = (questId: number) => {
    setQuests(quests.map(quest => 
      quest.id === questId ? { ...quest, completed: true } : quest
    ))
    // Here you would typically also update the user's points in your backend
    console.log(`Claimed ${quests.find(q => q.id === questId)?.points} points for quest ${questId}`)
  }

  const filteredQuests = activeCategory === 'all' ? quests : quests.filter(quest => quest.category === activeCategory)

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FBF7EF] pb-28 px-4 pt-8">
      <div className="w-full max-w-[368px]">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quests</h1>
        <div className="mb-6">
          <div className="flex justify-center space-x-2">
            {(['all', 'in-game', 'social', 'achievement'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {categoryIcons[category]}
              </button>
            ))}
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {filteredQuests.map(quest => (
              <div key={quest.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="mr-3">{quest.icon}</div>
                  <div className="flex-grow">
                    <h2 className="text-sm font-semibold text-gray-800">{quest.title}</h2>
                    <p className="text-xs text-gray-600">{quest.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-blue-600">
                      {quest.points} pts
                    </span>
                    {quest.completed ? (
                      <div className="mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        <Check className="w-4 h-4 inline-block mr-1" />
                        Claimed
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleClaimPoints(quest.id)} 
                        size="sm"
                        className="mt-1 px-2 py-0 h-6 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded-full"
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
