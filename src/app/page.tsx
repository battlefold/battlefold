'use client';

import React, { useState, useEffect } from 'react'
import BattleFold from '@/components/BattleFold'
import TelegramAuth from '@/components/TelegramAuth'

export default function Home() {
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName');
    }
    return null;
  });

  const handleUserAuthenticated = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  }

  useEffect(() => {
    // Check if the user is already authenticated
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div>
      {!userName && <TelegramAuth onUserAuthenticated={handleUserAuthenticated} />}
      <BattleFold userName={userName} />
    </div>
  )
}
