"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Server, Globe, Shield, Activity, Plus, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function NodesPage() {
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ name: '', ip: '', port: '3302', token: 'aether-secret-token' });

    useEffect(() => {
        fetchNodes();
    }, []);

    const fetchNodes = async () => {
        try {
            const { data } = await api.get('/mgmt/nodes');
            setNodes(data);
        } catch (e) {
            toast.error('Failed to load nodes');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNode = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/mgmt/nodes', formData);
            toast.success('Node added successfully!');
            setShowAdd(false);
            fetchNodes();
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Failed to add node');
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Node Management</h1>
                    <p className="text-white/40 text-sm mt-1">Manage physical server endpoints and monitoring.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all border-dashed"
                >
                    <Plus size={18} /> Add New Node
                </button>
            </div>

            {showAdd && (
                <div className="mb-10 p-8 glass rounded-3xl animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-6">Connect New Infrastructure</h2>
                    <form onSubmit={handleAddNode} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-2">Display Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Edge-Paris-01"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-2">IP Address / Domain</label>
                            <input
                                value={formData.ip}
                                onChange={e => setFormData({ ...formData, ip: e.target.value })}
                                placeholder="1.2.3.4"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-2">Daemon Port</label>
                            <input
                                value={formData.port}
                                onChange={e => setFormData({ ...formData, port: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-2">Daemon Token</label>
                            <input
                                type="password"
                                value={formData.token}
                                onChange={e => setFormData({ ...formData, token: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary/50 transition-all"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-4 mt-6">
                            <button type="submit" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
                                Link Infrastructure
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAdd(false)}
                                className="text-white/40 font-bold hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : nodes.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
                    <Globe className="mx-auto text-white/20 mb-4" size={40} />
                    <h3 className="text-xl font-bold">No Nodes Connected</h3>
                    <p className="text-white/40">You need at least one node to deploy servers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {nodes.map((node: any, i) => (
                        <div key={i} className="p-6 glass rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Server className="text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{node.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-xs text-white/40 flex items-center gap-1"><Globe size={12} /> {node.ip}:{node.port}</span>
                                        <span className="text-xs text-green-500 flex items-center gap-1"><Activity size={12} /> ONLINE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs font-bold uppercase text-white/20 tracking-widest">Resource Usage</div>
                                    <div className="text-sm font-medium mt-1">0 / 32 GB RAM</div>
                                </div>
                                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                    <Shield size={20} className="text-white/40" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
