'use client';

import { config } from '../utils/wagmi';
import * as React from 'react';
import { WagmiConfig } from 'wagmi';

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
