'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWhitelist, addToWhitelist, removeFromWhitelist, fetchServerStatus } from '@/lib/api';
import { ShieldCheck, UserPlus, UserMinus, Trash2, Loader2, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export default function WhitelistCard() {
  const [newPlayer, setNewPlayer] = useState('');
  const queryClient = useQueryClient();

  const { data: whitelistData, isLoading } = useQuery({
    queryKey: ['whitelist'],
    queryFn: fetchWhitelist,
  });

  const addMutation = useMutation({
    mutationFn: addToWhitelist,
    onSuccess: () => {
      toast.success('Player added to whitelist!');
      setNewPlayer('');
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWhitelist,
    onSuccess: () => {
      toast.success('Player removed from whitelist!');
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    refetchInterval: 10000,
  });
  const isRunning = status?.status === 'running' || status?.status === 'mock_running';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim()) {
      addMutation.mutate(newPlayer.trim());
    }
  };

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
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          Access Control
        </h3>
        <p className="text-slate-400 text-sm mt-1">Manage server whitelist</p>
      </div>
      
      <div className="flex flex-col gap-6 relative h-full">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input 
              id="username" 
              placeholder="Player Username (e.g. Notch)" 
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newPlayer.trim() || addMutation.isPending}
            className="sm:w-auto w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            Grant Access
          </button>
        </form>

        <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex-1 overflow-y-auto shadow-inner min-h-[200px]">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Approved Players</h4>
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
          ) : whitelistData?.players?.length > 0 ? (
            <ul className="space-y-2">
              {whitelistData.players.map((player: string) => (
                <li key={player} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                  <span className="font-medium text-slate-200">{player}</span>
                  <button
                    onClick={() => removeMutation.mutate(player)}
                    disabled={removeMutation.isPending}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Revoke access"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm text-center py-8">Whitelist is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
