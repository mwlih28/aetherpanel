"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Console } from '@/components/Console';
import { FileManager } from '@/components/FileManager';
import { PluginMarketplace } from '@/components/PluginMarketplace';
import { BackupManager } from '@/components/BackupManager';
import { Terminal, Folder, Box, Database, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

export default function ServerDetail() {
    const [activeTab, setActiveTab] = useState('console');

    const mockFiles = [
        { name: 'server.properties', isDirectory: false, size: 2048, mtime: new Date() },
        { name: 'world', isDirectory: true, size: null, mtime: new Date() },
        { name: 'logs', isDirectory: true, size: null, mtime: new Date() },
        { name: 'spigot.jar', isDirectory: false, size: 52428800, mtime: new Date() },
    ];

    const mockPlugins = [
        { title: 'EssentialsX', description: 'The essential plugin for Spigot servers.', author: 'EssentialsTeam' },
        { title: 'WorldEdit', description: 'In-game map editor and schematic processor.', author: 'EngineHub' },
        { title: 'LuckPerms', description: 'Advanced permissions system for Minecraft.', author: 'Luck' },
    ];

    const mockBackups = [
        { name: 'Daily Backup - Feb 7', size: 157286400, date: '2 hours ago' },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                <div className="flex gap-4 p-1 bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl w-max">
                    <TabButton icon={Terminal} label="Console" active={activeTab === 'console'} onClick={() => setActiveTab('console')} />
                    <TabButton icon={Folder} label="Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
                    <TabButton icon={Box} label="Plugins" active={activeTab === 'plugins'} onClick={() => setActiveTab('plugins')} />
                    <TabButton icon={Database} label="Backups" active={activeTab === 'backups'} onClick={() => setActiveTab('backups')} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'console' && <Console logs={['[Server] Initializing...', '[Server] Loading properties...', '[Server] Done! Listening on port 25565']} />}
                            {activeTab === 'files' && <FileManager files={mockFiles} />}
                            {activeTab === 'plugins' && <PluginMarketplace plugins={mockPlugins} onInstall={() => { }} />}
                            {activeTab === 'backups' && <BackupManager backups={mockBackups} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}
