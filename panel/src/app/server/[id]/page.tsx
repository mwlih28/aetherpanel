"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Console } from '@/components/Console';
import { FileManager } from '@/components/FileManager';
import { PluginMarketplace } from '@/components/PluginMarketplace';
import { Terminal, Folder, Box, Database, Power, RotateCw, Square, Loader2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ServerDetail() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('console');
    const [server, setServer] = useState<any>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [currentPath, setCurrentPath] = useState('');
    const [isEditing, setIsEditing] = useState<any>(null);
    const [plugins, setPlugins] = useState<any[]>([]);
    const [marketLoading, setMarketLoading] = useState(false);
    const [status, setStatus] = useState('OFFLINE');

    useEffect(() => {
        fetchServer();
        return () => { socket?.disconnect(); };
    }, [id]);

    const fetchServer = async () => {
        try {
            const { data } = await api.get(`/mgmt/servers`);
            const s = data.find((x: any) => x.id === id);
            if (!s) return toast.error('Server not found');
            setServer(s);
            connectSocket(s.node);
        } catch (e) {
            toast.error('Failed to load server details');
        }
    };

    const connectSocket = (node: any) => {
        const s = io(`http://${node.ip}:${node.port}`, {
            auth: { token: 'aether-secret-token' } // In production, use real node token
        });

        s.on('connect', () => {
            s.emit('server:join', { serverId: id });
            s.emit('file:list', { serverId: id, path: '' });
        });

        s.on('server:console:out', (data) => {
            setLogs(prev => [...prev.slice(-100), data]);
        });

        s.on('server:status', (data) => {
            setStatus(data.status);
        });

        s.on('file:list:res', (data) => {
            setFiles(data.files);
        });

        s.on('file:read:res', (data) => {
            setIsEditing({ name: data.name, content: data.content });
        });

        s.on('plugin:search:res', (data) => {
            setPlugins(data.plugins);
            setMarketLoading(false);
        });

        setSocket(s);
    };

    const sendCommand = (cmd: string) => {
        socket?.emit('server:console:in', { serverId: id, command: cmd });
    };

    const handlePower = (action: string) => {
        socket?.emit('server:power', { serverId: id, action });
        toast.info(`Power action ${action} initiated`);
    };

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
        socket?.emit('file:list', { serverId: id, path });
    };

    const handleDeleteFile = (name: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        socket?.emit('file:delete', { serverId: id, path: `${currentPath}/${name}` });
        setTimeout(() => handleNavigate(currentPath), 500);
    };

    const handleEditFile = (name: string) => {
        socket?.emit('file:read', { serverId: id, path: `${currentPath}/${name}` });
    };

    const handleSaveFile = (name: string, content: string) => {
        socket?.emit('file:write', { serverId: id, path: `${currentPath}/${name}`, content });
        setIsEditing(null);
        toast.success('File saved');
    };

    const handlePluginSearch = (q: string) => {
        setMarketLoading(true);
        socket?.emit('plugin:search', { query: q });
    };

    if (!server) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-10">
                {/* Server Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${status === 'RUNNING' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
                            }`}>
                            <Box size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">{server.name}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-2 text-xs font-black bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest text-white/40">
                                    <Link2 size={12} className="text-primary" /> {server.node.ip}:{server.port || 25565}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${status === 'RUNNING' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
                        <button onClick={() => handlePower('start')} className="p-4 hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 rounded-xl transition-all"><Power size={20} /></button>
                        <button onClick={() => handlePower('restart')} className="p-4 hover:bg-blue-500/10 text-blue-500 hover:text-blue-400 rounded-xl transition-all"><RotateCw size={20} /></button>
                        <button onClick={() => handlePower('stop')} className="p-4 hover:bg-red-500/10 text-red-500 hover:text-red-400 rounded-xl transition-all"><Square size={20} /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 p-2 bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2rem] w-max self-center md:self-start">
                    {[
                        { id: 'console', icon: Terminal, label: 'Terminal' },
                        { id: 'files', icon: Folder, label: 'Files' },
                        { id: 'plugins', icon: Box, label: 'Marketplace' },
                        { id: 'backups', icon: Database, label: 'Backups' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-white/30 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {activeTab === 'console' && <Console logs={logs} onCommand={sendCommand} />}
                            {activeTab === 'files' && (
                                <FileManager
                                    files={files}
                                    path={currentPath}
                                    onNavigate={handleNavigate}
                                    onDelete={handleDeleteFile}
                                    onEdit={handleEditFile}
                                    onSave={handleSaveFile}
                                    isEditing={isEditing}
                                    onCancelEdit={() => setIsEditing(null)}
                                />
                            )}
                            {activeTab === 'plugins' && (
                                <PluginMarketplace
                                    plugins={plugins}
                                    onSearch={handlePluginSearch}
                                    loading={marketLoading}
                                    onInstall={p => socket?.emit('plugin:install', { serverId: id, plugin: p })}
                                />
                            )}
                            {activeTab === 'backups' && (
                                <div className="p-20 text-center glass rounded-3xl border border-dashed border-white/10">
                                    <Database size={48} className="mx-auto text-white/5 mb-4" />
                                    <p className="font-bold text-white/20">Backup system coming soon</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}

