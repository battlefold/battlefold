'use client';

import React, { useState, useEffect } from 'react'
import BattleFold from '@/components/BattleFold'
import TelegramAuth from '@/components/TelegramAuth'
import { getUserInfo, refreshToken } from '@/utils/api';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleUserAuthenticated = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    const checkAuth = async () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedAccessToken && storedRefreshToken) {
        try {
          const userInfo = await getUserInfo(storedAccessToken);
          setUserName(userInfo.username || `${userInfo.first_name} ${userInfo.last_name || ''}`);
          setIsAuthenticated(true);
        } catch (error) {
          // Access token might be expired, try refreshing
          try {
            const newTokens = await refreshToken(storedRefreshToken);
            localStorage.setItem('accessToken', newTokens.access_token);
            localStorage.setItem('refreshToken', newTokens.refresh_token);
            const userInfo = await getUserInfo(newTokens.access_token);
            setUserName(userInfo.username || `${userInfo.first_name} ${userInfo.last_name || ''}`);
            setIsAuthenticated(true);
          } catch (refreshError) {
            // Refresh failed, user needs to re-authenticate
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
            setAuthError('Authentication failed. Please try again.');
          }
        }
      } else {
        // No stored tokens, we need to authenticate
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div>
      {!isAuthenticated && (
        <TelegramAuth onUserAuthenticated={handleUserAuthenticated} />
      )}
      {authError && <div className="text-red-500">{authError}</div>}
      {isAuthenticated ? (
        <BattleFold userName={userName} />
      ) : (
        <div>Waiting for authentication...</div>
      )}
    </div>
  )
}
