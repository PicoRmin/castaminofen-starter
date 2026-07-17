'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';

export function MobileContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('mobile-container mx-auto w-full max-w-app px-4 sm:px-6 lg:px-8', className)}>{children}</div>
  );
}
