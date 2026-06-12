'use client';

import { Terminal, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { executeCommand } from '@/lib/api';
import { toast } from 'sonner';

export default function WebConsole() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{ type: 'in' | 'out', text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const commandMutation = useMutation({
    mutationFn: executeCommand,
    onSuccess: (data) => {
      setHistory(prev => [...prev, { type: 'out', text: data.response || 'Success' }]);
    },
    onError: (error: Error) => {
      setHistory(prev => [...prev, { type: 'out', text: `Error: ${error.message}` }]);
      toast.error(error.message);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    setHistory(prev => [...prev, { type: 'in', text: `> ${command.trim()}` }]);
    commandMutation.mutate(command.trim());
    setCommand('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-slate-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-slate-300" />
          </div>
          Remote Terminal Session
        </h3>
        <p className="text-slate-400 text-sm mt-1">Direct RCON command execution</p>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl p-6 overflow-y-auto mb-4 font-mono text-sm flex flex-col gap-1.5 shadow-inner"
      >
        {history.length === 0 && (
          <p className="text-slate-600 italic">Connected to RCON. Type 'help' to see available commands.</p>
        )}
        {history.map((line, i) => (
          <div key={i} className={line.type === 'in' ? 'text-emerald-400' : 'text-slate-300 whitespace-pre-wrap'}>
            {line.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSend} className="flex gap-4 relative">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-mono">$&gt;</span>
          <input 
            placeholder="Enter command..." 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all pl-10 font-mono"
            disabled={commandMutation.isPending}
            autoFocus
          />
        </div>
        <button 
          type="submit" 
          disabled={!command.trim() || commandMutation.isPending}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-medium py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-8 flex items-center justify-center gap-2 rounded-xl"
        >
          {commandMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Execute
        </button>
      </form>
    </div>
  );
}
