'use client';

import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { MobileContainer } from '@/components/layout/mobile-container';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell min-h-screen flex flex-col bg-surface-primary text-text-primary">
      <Header />
      <main className="flex-1">
        <MobileContainer>
          <div className="app-shell__content py-4">{children}</div>
        </MobileContainer>
      </main>
      <BottomNavigation />
    </div>
  );
}
