'use client';

import React from 'react';
import { useTelegramInitData } from '@/hooks/useTelegramInitData';

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
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Oops</h2>
        <p>Application was launched with missing init data</p>
      </div>
    );
  }

  const initDataRows: DisplayDataRow[] = [
    { title: 'auth_date', value: initData.auth_date },
    { title: 'query_id', value: initData.query_id },
    { title: 'hash', value: initData.hash },
  ];

  const userRows: DisplayDataRow[] = initData.user
    ? [
        { title: 'id', value: initData.user.id },
        { title: 'first_name', value: initData.user.first_name },
        { title: 'last_name', value: initData.user.last_name },
        { title: 'username', value: initData.user.username },
        { title: 'language_code', value: initData.user.language_code },
      ]
    : [];

  return (
    <div className="p-4">
      <DisplayData header={'Init Data'} rows={initDataRows} />
      {initData.user && <DisplayData header={'User'} rows={userRows} />}
    </div>
  );
}
