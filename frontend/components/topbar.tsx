'use client';

import { Bell, Search, MoreVertical } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="topbar sticky top-0 z-40 w-full bg-[#000000]/80 backdrop-blur border-b border-[#1a1a1a] px-8 py-4">
      <div className="flex items-center justify-between h-16">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={20} />
            <input
              type="text"
              placeholder="Search markets, repos..."
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#888888] focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-6 ml-8">
          {/* Notifications */}
          <button className="relative text-[#888888] hover:text-[#00ff00] transition-colors">
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ff3333] text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff00] to-[#00ccff] flex items-center justify-center text-[#000000] font-bold">
                A
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-white">Artem</div>
                <div className="text-xs text-[#888888]">@artemwalker</div>
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-[#1a1a1a]">
                  <div className="text-sm font-semibold text-white">Artem</div>
                  <div className="text-xs text-[#888888]">@artemwalker</div>
                </div>

                <nav className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#1a1a1a] transition-colors">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#1a1a1a] transition-colors">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#1a1a1a] transition-colors">
                    Wallet
                  </button>
                </nav>

                <div className="border-t border-[#1a1a1a] p-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-[#ff3333] hover:bg-[#1a1a1a] transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Get in Touch Button */}
          <button className="btn-primary-green text-sm whitespace-nowrap">
            Get in touch
          </button>

          {/* More Menu */}
          <button className="text-[#888888] hover:text-[#00ff00] transition-colors">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
