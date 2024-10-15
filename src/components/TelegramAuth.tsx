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
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const authenticate = async () => {
      if (initDataRaw) {
        setIsLoading(true);
        addLog('Starting authentication process');
        addLog(`Init data: ${initDataRaw}`);
        try {
          addLog('Sending authentication request to server');
          const authResult = await authenticateTelegram(initDataRaw);
          addLog(`Authentication response: ${JSON.stringify(authResult)}`);
          localStorage.setItem('accessToken', authResult.access_token);
          localStorage.setItem('refreshToken', authResult.refresh_token);

          addLog('Fetching user info');
          const userInfo = await getUserInfo(authResult.access_token);
          addLog(`User info: ${JSON.stringify(userInfo)}`);
          const userName = userInfo.username || `${userInfo.first_name} ${userInfo.last_name || ''}`;
          onUserAuthenticated(userName);
          localStorage.setItem('isAuthenticated', 'true');
          addLog('Authentication process completed successfully');
        } catch (error: any) {
          console.error('Authentication failed:', error);
          const errorMessage = `Authentication failed: ${error.message}. ${JSON.stringify(error.response?.data || {})}`;
          setError(errorMessage);
          addLog(`Error: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        const noDataMessage = 'No Telegram init data found. Please open this app in Telegram.';
        setError(noDataMessage);
        addLog(noDataMessage);
      }
    };

    authenticate();
  }, [initDataRaw, onUserAuthenticated]);

  if (isLoading) {
    return (
      <div>
        <div className="text-center py-2">Authenticating...</div>
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
          {logs.join('\n')}
        </pre>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="https://t.me/BattleFold_bot/game" className="block w-full bg-red-500 text-white text-center py-2 px-4 hover:bg-red-600 transition-colors">
          Error: {error}. Please open this app in Telegram.
        </Link>
        <div>Init data: {initDataRaw ? 'Present' : 'Not present'}</div>
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
          {logs.join('\n')}
        </pre>
      </div>
    );
  }

  return (
    <div>
      <div>Authentication successful!</div>
      <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
        {logs.join('\n')}
      </pre>
    </div>
  );
};

export default TelegramAuth;
