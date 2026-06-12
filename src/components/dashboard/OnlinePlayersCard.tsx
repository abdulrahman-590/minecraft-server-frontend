'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchOnlinePlayers, fetchServerStatus } from '@/lib/api';
import { Users, UsersRound, Loader2, PowerOff } from 'lucide-react';

export default function OnlinePlayersCard() {
  const { data: playersData, isLoading } = useQuery({
    queryKey: ['onlinePlayers'],
    queryFn: fetchOnlinePlayers,
    refetchInterval: 10000,
  });

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    refetchInterval: 10000,
  });
  const isRunning = status?.status === 'running' || status?.status === 'mock_running';

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 h-full relative overflow-hidden">
      {!isRunning && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-slate-900/80 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
            <PowerOff className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 text-sm font-medium tracking-wide uppercase">System Offline</span>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 p-32 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          Online Players
        </h3>
        <div className="flex justify-between items-end mt-1">
          <p className="text-slate-400 text-sm">Currently connected</p>
          <span className="text-xs font-semibold bg-teal-500/20 text-teal-300 px-2 py-1 rounded-md">
            {playersData?.players?.length || 0} Online
          </span>
        </div>
      </div>
      
      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
        ) : (
          <div className="min-h-[80px]">
            {playersData?.players?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {playersData.players.map((player: string) => (
                  <div key={player} className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                    {player}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                <UsersRound className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No players online.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
