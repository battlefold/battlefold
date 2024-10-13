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

export default function TelegramAuth() {
  const initData = useTelegramInitData();

  if (!initData) {
    return (
      <div className="bg-blue-500 text-white py-2 px-4 text-sm flex justify-between items-center">
        <span>🚀 Launch BattleFold in Telegram for the full experience!</span>
        <Link 
          href="https://t.me/BattleFold_bot/game" 
          className="bg-white text-blue-500 px-2 py-1 rounded text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          Open
        </Link>
      </div>
    );
  }

  // If initData is present, the app is opened in Telegram
  // We don't render anything in this case
  return null;
}
