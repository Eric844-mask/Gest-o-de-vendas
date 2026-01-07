
import React from 'react';
import { View } from '../types';
import { NAV_ITEMS, THEME } from '../constants';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, title, children, actions }) => {
  return (
    <div className="flex flex-col min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 w-full max-w-md mx-auto animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === item.id ? `text-${THEME.primary}` : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
