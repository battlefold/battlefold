'use client';

import React, { useEffect } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

interface TelegramAuthProps {
  onUserAuthenticated: (name: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onUserAuthenticated }) => {
  const { initData, error } = useTelegramInitData();

  useEffect(() => {
    if (initData && initData.user) {
      const userName = `${initData.user.first_name}${initData.user.last_name ? ' ' + initData.user.last_name : ''}`;
      onUserAuthenticated(userName);
    }
  }, [initData, onUserAuthenticated]);

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <p>Please try reloading the app or contact support if the issue persists.</p>
      </div>
    );
  }

  if (!initData) {
    return <div>Loading Telegram authentication...</div>;
  }

  return null;
};

export default TelegramAuth;
