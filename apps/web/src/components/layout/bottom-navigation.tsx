'use client';

import { Home, Search, Layers, User } from 'lucide-react';

const navigationItems = [
  { label: 'تب ۱', icon: Home },
  { label: 'تب ۲', icon: Search },
  { label: 'تب ۳', icon: Layers },
  { label: 'تب ۴', icon: User },
];

export function BottomNavigation() {
  return (
    <nav className="bottom-navigation fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface-secondary/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-app items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className="bottom-navigation__item group flex min-h-[3rem] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-transparent bg-transparent px-2 py-2 text-center text-xs font-medium text-text-secondary transition hover:border-border hover:bg-surface-primary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-secondary"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
