'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl m-6 mr-0 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight">
          Portal<span className="font-light text-slate-400">OS</span>
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          System Online
        </div>
      </div>
    </aside>
  );
}
