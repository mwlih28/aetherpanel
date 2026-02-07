"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { ServerCard } from '@/components/ServerCard';
import { LayoutGrid, Plus, Server, HardDrive, Cpu, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            const { data } = await api.get('/mgmt/servers');
            setServers(data);
        } catch (error: any) {
            toast.error('Failed to fetch servers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Your Infrastructure</h1>
                    <p className="text-white/40 text-sm mt-1">Real-time overview of your game instances across all nodes.</p>
                </div>
                <Link
                    href="/admin/servers/new"
                    className="flex items-center justify-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} /> Deploy New Instance
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
                    <Loader2 className="animate-spin text-primary mb-4" size={40} />
                    <p className="text-white/40 font-medium">Synchronizing with nodes...</p>
                </div>
            ) : servers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                        <Server className="text-white/20" size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Instances Found</h2>
                    <p className="text-white/40 text-center max-w-sm mb-8">
                        You haven't deployed any servers yet. Start by creating your first node then deploy a Minecraft instance.
                    </p>
                    <Link
                        href="/admin/servers/new"
                        className="text-primary font-bold hover:underline"
                    >
                        Create your first server &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map((server, i) => (
                        <ServerCard key={i} {...server} />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
