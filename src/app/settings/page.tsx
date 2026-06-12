import WebConsole from '@/components/dashboard/WebConsole';
import SettingsCard from '@/components/dashboard/SettingsCard';

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-12 h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Settings & Console
        </h1>
        <p className="text-slate-400 mt-2">Manage server preferences, create backups, and execute commands.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <SettingsCard />
        </div>
        <div className="lg:col-span-2 flex flex-col">
          <WebConsole />
        </div>
      </div>
    </div>
  );
}
