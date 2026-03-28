'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  GitBranch,
  User,
  Terminal,
  Logo as LogoIcon,
} from 'lucide-react';

const navItems = [
  {
    label: 'The Pulse',
    href: '/',
    icon: LayoutDashboard,
    description: 'Dashboard',
  },
  {
    label: 'The Fleet',
    href: '/explore',
    icon: Compass,
    description: 'Explorer',
  },
  {
    label: 'War Room',
    href: '/market/sample',
    icon: TrendingUp,
    description: 'Market',
  },
  {
    label: 'Repo Intel',
    href: '/repo/sample/repo',
    icon: GitBranch,
    description: 'Repository',
  },
  {
    label: 'Architect',
    href: '/architect',
    icon: User,
    description: 'Agent Profile',
  },
  {
    label: 'Terminal',
    href: '/terminal',
    icon: Terminal,
    description: 'Raw Feed',
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-nav sticky top-0 w-20 h-screen flex flex-col items-center py-6 px-2">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <div className="w-12 h-12 rounded-lg bg-[#00ff00] flex items-center justify-center">
          <span className="text-[#000000] font-bold text-lg">P</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                isActive
                  ? 'bg-[#00ff00] text-[#000000] shadow-lg shadow-[#00ff00]/50'
                  : 'text-[#888888] hover:text-[#00ff00] hover:bg-[#1a1a1a]'
              }`}
              title={item.label}
            >
              <Icon size={24} />

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 px-3 py-2 bg-[#1a1a1a] text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-[#333333]">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - could be used for settings/logout */}
      <div className="mt-auto">
        <button
          className="w-12 h-12 rounded-lg text-[#888888] hover:text-[#00ff00] hover:bg-[#1a1a1a] flex items-center justify-center transition-all duration-200"
          title="Settings"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
