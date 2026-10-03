import React from 'react';
import { TabId } from '../types/forensics';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const navItems: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: 'radar' },
    { id: 'timeline', label: 'Timeline', icon: 'graphic_eq' },
    { id: 'model-lab', label: 'Model Lab', icon: 'neurology' },
    { id: 'case-logs', label: 'Case Logs', icon: 'shield_with_heart' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 w-full z-50 pb-safe bg-[#0b1326]/95 backdrop-blur-xl border-t border-[#222a3d]/70 shadow-[0_-4px_24px_rgba(0,0,0,0.65)]"
      aria-label="Primary Navigation"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'text-primary font-semibold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
                  }}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className="font-mono text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
