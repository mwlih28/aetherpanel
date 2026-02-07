"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, HardDrive, Activity } from 'lucide-react';

interface ServerCardProps {
    name: string;
    ip: string;
    status: 'ONLINE' | 'OFFLINE' | 'STARTING';
    cpu: number;
    memory: string;
    disk: string;
}

export const ServerCard = ({ name, ip, status, cpu, memory, disk }: ServerCardProps) => {
    const statusColor = {
        ONLINE: 'bg-emerald-500',
        OFFLINE: 'bg-rose-500',
        STARTING: 'bg-amber-500',
    }[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-card/40 backdrop-blur-md border border-border p-6 rounded-3xl hover:border-primary/50 transition-colors group"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{name}</h3>
                    <p className="text-sm text-muted-foreground font-mono mt-1">{ip}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <Cpu size={18} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">CPU</p>
                        <p className="font-semibold text-sm">{cpu}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <Activity size={18} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">RAM</p>
                        <p className="font-semibold text-sm">{memory}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                    <HardDrive size={18} className="text-primary" />
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none">Disk</p>
                        <p className="font-semibold text-sm">{disk}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50 flex gap-2">
                <a href={`/server/${name.toLowerCase().replace(/ /g, '-')}`} className="flex-1 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center">
                    Manage
                </a>
                <button className="px-3 py-2 bg-muted/50 text-muted-foreground rounded-xl text-sm hover:text-foreground transition-all">
                    Console
                </button>
            </div>
        </motion.div>
    );
};
