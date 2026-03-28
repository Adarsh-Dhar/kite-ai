'use client';

import { SidebarNav } from './sidebar-nav';
import { Topbar } from './topbar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#000000]">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#000000]">
          {children}
        </main>
      </div>
    </div>
  );
}
