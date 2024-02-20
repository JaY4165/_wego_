'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function Trip() {
  const sp = useSearchParams();
  const resData = sp.get('data');

  return <div>{resData}</div>;
}
