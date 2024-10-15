'use client';

import React, { useEffect, useState } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import Link from 'next/link';
import { authenticateTelegram, getUserInfo } from '@/utils/api';

interface TelegramAuthProps {
  onUserAuthenticated: (name: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onUserAuthenticated }) => {
  const { initDataRaw, error: initDataError } = useTelegramInitData();
  const [error, setError] = useState<string | null>(initDataError);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      if (initDataRaw) {
        setIsLoading(true);
        try {
          console.log('Attempting to authenticate with Telegram data:', initDataRaw);
          const authResult = await authenticateTelegram(initDataRaw);
          console.log('Authentication result:', authResult);
          localStorage.setItem('accessToken', authResult.access_token);
          localStorage.setItem('refreshToken', authResult.refresh_token);

          console.log('Fetching user info...');
          const userInfo = await getUserInfo(authResult.access_token);
          console.log('User info:', userInfo);
          onUserAuthenticated(userInfo.username || `${userInfo.first_name} ${userInfo.last_name || ''}`);
          localStorage.setItem('isAuthenticated', 'true');
        } catch (error: any) {
          console.error('Authentication failed:', error);
          setError(`Authentication failed: ${error.message}. ${JSON.stringify(error.response?.data || {})}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('No Telegram init data found. Please open this app in Telegram.');
      }
    };

    authenticate();
  }, [initDataRaw, onUserAuthenticated]);

  if (isLoading) {
    return <div className="text-center py-2">Authenticating...</div>;
  }

  if (error) {
    return (
      <div>
        <Link href="https://t.me/BattleFold_bot/game" className="block w-full bg-red-500 text-white text-center py-2 px-4 hover:bg-red-600 transition-colors">
          Error: {error}. Please open this app in Telegram.
        </Link>
        <div>Init data: {initDataRaw ? 'Present' : 'Not present'}</div>
      </div>
    );
  }

  return null;
};

export default TelegramAuth;
