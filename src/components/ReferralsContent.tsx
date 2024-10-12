"use client"

import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Users, Copy, Check, Share2, Percent } from 'lucide-react'

export default function ReferralsContent() {
  const [copied, setCopied] = useState(false)
  const referralCode = "BATTLEFOLD123"  // This should be dynamically generated for each user

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FBF7EF] pb-28 px-4 pt-8">
      <div className="w-full max-w-[368px]">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Play with Frens</h1>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg shadow-md mb-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Share2 className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Invite Friends</h2>
            </div>
            <div className="bg-white bg-opacity-20 rounded-md px-2 py-1">
              <span className="font-mono text-sm">{referralCode}</span>
            </div>
          </div>
          <p className="text-sm mb-3 opacity-90">
            Share your code and earn rewards!
          </p>
          <Button 
            className="w-full bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm" 
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Invite'}
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Referral Rewards</h2>
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-gray-600">
              Earn 100 points for each friend who joins
            </p>
          </div>
          <div className="flex items-center">
            <Percent className="w-5 h-5 text-blue-500 mr-2" />
            <p className="text-sm text-gray-600">
              Earn 1% of total points your friends earn
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Friends</h2>
        <ScrollArea className="h-[calc(100vh-500px)]">
          <div className="space-y-2">
            <ReferralItem name="John Doe" points={1500} earnedPoints={15} />
            <ReferralItem name="Jane Smith" points={2200} earnedPoints={22} />
            <ReferralItem name="Bob Johnson" points={800} earnedPoints={8} />
            {/* Add more referral items here */}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function ReferralItem({ name, points, earnedPoints }: { name: string; points: number; earnedPoints: number }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <Users className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <p className="font-medium text-gray-800 text-sm">{name}</p>
          <p className="text-xs text-gray-500">{points} pts</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-green-600 text-sm">+{earnedPoints}</p>
      </div>
    </div>
  )
}
