import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavigationBar from '@/components/NavigationBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BattleFold',
  description: 'A strategic naval battle game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <NavigationBar />
        </div>
      </body>
    </html>
  )
}
