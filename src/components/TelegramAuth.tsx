'use client';

import React, { useEffect } from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

interface TelegramAuthProps {
  onUserAuthenticated: (name: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onUserAuthenticated }) => {
  const { initDataState, initDataRows, userRows, error } = useTelegramInitData();

  useEffect(() => {
    if (initDataState?.user) {
      const userName = `${initDataState.user.first_name}${initDataState.user.last_name ? ' ' + initDataState.user.last_name : ''}`;
      onUserAuthenticated(userName);
    }
  }, [initDataState, onUserAuthenticated]);

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <p>Please try reloading the app or contact support if the issue persists.</p>
      </div>
    );
  }

  if (!initDataState) {
    return <div>Loading Telegram authentication...</div>;
  }

  return (
    <div>
      <h2>Init Data</h2>
      <table>
        <tbody>
          {initDataRows?.map((row, index) => (
            <tr key={index}>
              <td>{row.title}:</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {userRows && (
        <>
          <h2>User Data</h2>
          <table>
            <tbody>
              {userRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.title}:</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TelegramAuth;
