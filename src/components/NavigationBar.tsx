"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Swords, Trophy, Gift, Users } from 'lucide-react'

type Page = 'game' | 'ranking' | 'instructions' | 'quests' | 'referrals'

const getBackgroundColor = (page: Page) => {
  switch (page) {
    case 'instructions': return 'bg-[#D3E3F3]'
    case 'referrals': return 'bg-[#E3D3F3]'
    case 'game': return 'bg-[#D3F3E3]'
    case 'ranking': return 'bg-[#F3EBD3]'
    case 'quests': return 'bg-[#F3D3E3]'
  }
}

const getIcon = (page: Page) => {
  switch (page) {
    case 'instructions': return <BookOpen className="w-6 h-6 text-white" />
    case 'referrals': return <Users className="w-6 h-6 text-white" />
    case 'game': return <Swords className="w-6 h-6 text-white" />
    case 'ranking': return <Trophy className="w-6 h-6 text-white" />
    case 'quests': return <Gift className="w-6 h-6 text-white" /> // Changed from Target to Gift
  }
}

export default function NavigationBar() {
  const pathname = usePathname()
  const currentPage: Page = 
    pathname === '/' ? 'game' :
    pathname === '/ranking' ? 'ranking' :
    pathname === '/instructions' ? 'instructions' :
    pathname === '/quests' ? 'quests' :
    pathname === '/referrals' ? 'referrals' :
    'game'

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-[#FBF7EF]">
      <div className="flex justify-between items-end max-w-md w-full px-4">
        {(['instructions', 'referrals', 'game', 'ranking', 'quests'] as const).map((page) => (
          <Link 
            key={page}
            href={page === 'game' ? '/' : `/${page}`}
            className={`w-[18%] cursor-pointer overflow-hidden`} 
          >
            <div 
              className={`w-full ${getBackgroundColor(page)} rounded-t-full transition-all duration-300 ease-in-out flex items-center justify-center ${currentPage === page ? 'h-24' : 'h-20'}`}
            >
              <div className={`w-12 h-12 rounded-full bg-black flex items-center justify-center`}>
                {getIcon(page)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
