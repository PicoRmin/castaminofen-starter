'use client';

import { Menu, Search, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="app-header sticky top-0 z-30 border-b border-border bg-surface-secondary/95 backdrop-blur-xl">
      <div className="mobile-container flex items-center justify-between gap-3 py-4">
        <div>
          <p className="text-caption uppercase text-text-secondary">Castaminofen</p>
          <h1 className="text-heading">پوسته‌ی اصلی</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="icon-button" aria-label="Open navigation placeholders">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="Search placeholder">
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="Settings placeholder">
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
