'use client';

import React, { useEffect, useState } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import Link from 'next/link';

interface TelegramAuthProps {
  onUserAuthenticated: (name: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onUserAuthenticated }) => {
  const { initDataState, error } = useTelegramInitData();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (initDataState?.user) {
      const userName = `${initDataState.user.first_name}${initDataState.user.last_name ? ' ' + initDataState.user.last_name : ''}`;
      onUserAuthenticated(userName);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [initDataState, onUserAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <Link href="https://t.me/BattleFold_bot/game" className="block w-full bg-red-500 text-white text-center py-2 px-4 hover:bg-red-600 transition-colors">
        Error: Please open this app in Telegram
      </Link>
    );
  }

  if (!initDataState) {
    return <div className="text-center py-2">Loading Telegram authentication...</div>;
  }

  return null;
};

export default TelegramAuth;
