import ServerControlCard from '@/components/dashboard/ServerControlCard';
import MetricsCard from '@/components/dashboard/MetricsCard';
import WhitelistCard from '@/components/dashboard/WhitelistCard';
import OnlinePlayersCard from '@/components/dashboard/OnlinePlayersCard';
import WorldControlCard from '@/components/dashboard/WorldControlCard';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          System Overview
        </h1>
        <p className="text-slate-400 mt-2">Manage your instance infrastructure and player access.</p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Top Section: Essential Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1">
              <ServerControlCard />
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1">
              <MetricsCard />
            </div>
          </div>
        </div>

        {/* Middle Section: Player Access & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex-1">
              <OnlinePlayersCard />
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-1">
              <WhitelistCard />
            </div>
          </div>
        </div>

        {/* Bottom Section: World Control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 flex flex-col">
            <div className="flex-1">
              <WorldControlCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
