'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setTime, setWeather, setGameMode, fetchOnlinePlayers, fetchWorldState, fetchServerStatus } from '@/lib/api';
import { Globe, Sun, Moon, CloudRain, CloudLightning, Gamepad2, Loader2, UsersRound, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export default function WorldControlCard() {
  const queryClient = useQueryClient();
  const [playerModes, setPlayerModes] = useState<Record<string, string>>({});

  const { data: playersData } = useQuery({
    queryKey: ['onlinePlayers'],
    queryFn: fetchOnlinePlayers,
    refetchInterval: 10000,
  });

  const { data: worldState, isLoading: isWorldStateLoading } = useQuery({
    queryKey: ['worldState'],
    queryFn: fetchWorldState,
    refetchInterval: 10000,
  });

  const timeMutation = useMutation({
    mutationFn: setTime,
    onSuccess: () => {
      toast.success('Time updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['worldState'] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const weatherMutation = useMutation({
    mutationFn: setWeather,
    onSuccess: () => {
      toast.success('Weather updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['worldState'] });
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const modeMutation = useMutation({
    mutationFn: ({ mode, player }: { mode: string, player: string }) => setGameMode(mode, player),
    onSuccess: () => toast.success('Game mode updated!'),
    onError: (e: Error) => toast.error(e.message)
  });

  const handleModeChange = (player: string, mode: string) => {
    setPlayerModes(prev => ({ ...prev, [player]: mode }));
  };

  const handleApplyMode = (player: string) => {
    const mode = playerModes[player] || 'survival';
    modeMutation.mutate({ mode, player });
  };

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
      <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          World Management
        </h3>
        <p className="text-slate-400 text-sm mt-1">Environment and Game Mode</p>
      </div>
      
      <div className="flex flex-col gap-6 relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</span>
              <span className="text-xs font-semibold bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md shadow-inner">
                {isWorldStateLoading ? '...' : worldState?.time || 'Unknown'}
              </span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => timeMutation.mutate('day')}
                disabled={timeMutation.isPending}
                className="flex-1 bg-white/5 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <Sun className="w-4 h-4" /> Day
              </button>
              <button 
                onClick={() => timeMutation.mutate('night')}
                disabled={timeMutation.isPending}
                className="flex-1 bg-white/5 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <Moon className="w-4 h-4" /> Night
              </button>
            </div>
          </div>

          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weather</span>
              <span className="text-xs font-semibold bg-sky-500/10 text-sky-400 px-2 py-1 rounded-md shadow-inner">
                {isWorldStateLoading ? '...' : worldState?.weather || 'Clear'}
              </span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => weatherMutation.mutate('clear')}
                disabled={weatherMutation.isPending}
                className="flex-1 bg-white/5 hover:bg-sky-500/10 text-slate-300 hover:text-sky-400 border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => weatherMutation.mutate('rain')}
                disabled={weatherMutation.isPending}
                className="flex-1 bg-white/5 hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <CloudRain className="w-4 h-4" />
              </button>
              <button 
                onClick={() => weatherMutation.mutate('thunder')}
                disabled={weatherMutation.isPending}
                className="flex-1 bg-white/5 hover:bg-purple-500/10 text-slate-300 hover:text-purple-400 border border-white/5 rounded-xl py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <CloudLightning className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Gamepad2 className="w-4 h-4" /> Player Game Modes
          </span>
          
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {playersData?.players?.length > 0 ? (
              playersData.players.map((player: string) => (
                <div key={player} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2 pl-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                    <span className="text-slate-200 font-medium text-sm truncate">{player}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={playerModes[player] || 'survival'}
                      onChange={(e) => handleModeChange(player, e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-xs"
                    >
                      <option value="survival">Survival</option>
                      <option value="creative">Creative</option>
                      <option value="spectator">Spectator</option>
                      <option value="adventure">Adventure</option>
                    </select>
                    <button 
                      onClick={() => handleApplyMode(player)}
                      disabled={modeMutation.isPending}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium py-1.5 px-3 rounded-lg transition-all disabled:opacity-50 text-xs border border-amber-500/20"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500 bg-white/5 rounded-xl border border-white/5">
                <UsersRound className="w-6 h-6 mb-2 opacity-30" />
                <p className="text-xs">No players currently online.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
