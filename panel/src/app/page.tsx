"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { ServerCard } from '@/components/ServerCard';

const mockServers = [
  { name: 'Minecraft Survival', ip: 'node1.aether.panel:25565', status: 'ONLINE', cpu: 12, memory: '4GB / 8GB', disk: '20GB / 50GB' },
  { name: 'Counter-Strike 2', ip: 'node1.aether.panel:27015', status: 'STARTING', cpu: 0, memory: '1GB / 4GB', disk: '15GB / 30GB' },
  { name: 'Discord Bot', ip: 'node2.aether.panel:8080', status: 'OFFLINE', cpu: 0, memory: '0MB / 512MB', disk: '1GB / 5GB' },
  { name: 'PostgreSQL DB', ip: 'node2.aether.panel:5432', status: 'ONLINE', cpu: 2, memory: '512MB / 2GB', disk: '10GB / 20GB' },
];

export default function Home() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServers.map((server, i) => (
          <ServerCard key={i} {...(server as any)} />
        ))}
      </div>
    </DashboardLayout>
  );
}
