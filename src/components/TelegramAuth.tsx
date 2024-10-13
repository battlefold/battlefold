'use client';

import React from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';
import Link from 'next/link';

type DisplayDataRow = {
  title: string;
  value: string | number | boolean | undefined;
};

function DisplayData({ header, rows }: { header: string; rows: DisplayDataRow[] }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">{header}</h2>
      {rows.map((row, index) => (
        <div key={index} className="mb-1">
          <span className="font-semibold">{row.title}: </span>
          <span>{row.value?.toString() || 'N/A'}</span>
        </div>
      ))}
    </div>
  );
}

interface TelegramAuthProps {
  onUserAuthenticated: (name: string) => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onUserAuthenticated }) => {
  const initData = useTelegramInitData();

  React.useEffect(() => {
    if (initData?.user) {
      const userName = `${initData.user.first_name}${initData.user.last_name ? ' ' + initData.user.last_name : ''}`;
      onUserAuthenticated(userName);
    }
  }, [initData, onUserAuthenticated]);

  return null; // This component doesn't render anything
};

export default TelegramAuth;
