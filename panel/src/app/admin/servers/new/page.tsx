"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Server, Cpu, HardDrive, Database, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateServerPage() {
    const [step, setStep] = useState(1);
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        nodeId: '',
        type: 'MINECRAFT',
        version: 'LATEST',
        memory: '2048',
        cpu: '1',
        disk: '10'
    });

    useEffect(() => {
        api.get('/mgmt/nodes').then(res => {
            setNodes(res.data);
            if (res.data.length > 0) setFormData(prev => ({ ...prev, nodeId: res.data[0].id }));
            setLoading(false);
        });
    }, []);

    const handleCreate = async () => {
        setSubmitting(true);
        try {
            await api.post('/mgmt/servers', {
                ...formData,
                memory: parseInt(formData.memory),
                cpu: parseInt(formData.cpu),
                disk: parseInt(formData.disk)
            });
            toast.success('Server creation initiated!');
            setStep(4); // Success step
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Failed to create server');
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Deploy Instance</h1>
                    <p className="text-white/40 font-medium">Step {step} of 3: {
                        step === 1 ? 'General Information' :
                            step === 2 ? 'Resource Allocation' :
                                step === 3 ? 'Review & Launch' : 'Deployment Started'
                    }</p>

                    <div className="flex gap-2 mt-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-white/40 tracking-widest ml-1">Instance Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="My Epic Survival"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-primary transition-all text-lg font-medium"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-white/40 tracking-widest ml-1">Target Node</label>
                                <select
                                    value={formData.nodeId}
                                    onChange={e => setFormData({ ...formData, nodeId: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-primary transition-all text-lg font-medium appearance-none"
                                >
                                    {nodes.map((node: any) => (
                                        <option key={node.id} value={node.id} className="bg-[#1a1a1a]">{node.name} ({node.ip})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-white/40 tracking-widest ml-1">Server Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['MINECRAFT', 'SQL', 'BOT', 'WEB'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${formData.type === type ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <Server size={24} className={formData.type === type ? 'text-primary' : 'text-white/20'} />
                                        <span className="text-sm font-bold">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-10">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.name || !formData.nodeId}
                                className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
                            >
                                Next Step <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Memory (MB)', icon: Database, value: formData.memory, key: 'memory' },
                                { label: 'CPU Cores', icon: Cpu, value: formData.cpu, key: 'cpu' },
                                { label: 'Disk (GB)', icon: HardDrive, value: formData.disk, key: 'disk' },
                            ].map((res, i) => (
                                <div key={i} className="p-8 glass rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <res.icon className="text-primary" size={20} />
                                        <span className="text-xs font-black uppercase tracking-widest text-white/40">{res.label}</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={res.value}
                                        onChange={e => setFormData({ ...formData, [res.key]: e.target.value })}
                                        className="w-full bg-transparent text-4xl font-black focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-10">
                            <button onClick={() => setStep(1)} className="text-white/40 font-bold hover:text-white transition-colors">Go Back</button>
                            <button
                                onClick={() => setStep(3)}
                                className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white/90 transition-all"
                            >
                                Review Configuration <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                        <h2 className="text-3xl font-black mb-10">Confirm Deployment</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 px-10">
                            <div className="text-left">
                                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Instance</p>
                                <p className="text-lg font-bold">{formData.name}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Type</p>
                                <p className="text-lg font-bold">{formData.type}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Resources</p>
                                <p className="text-lg font-bold">{formData.memory}MB / {formData.cpu} Core</p>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Location</p>
                                <p className="text-lg font-bold">{(nodes.find((n: any) => n.id === formData.nodeId) as any)?.name || 'Unknown Node'}</p>
                            </div>

                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <button
                                disabled={submitting}
                                onClick={handleCreate}
                                className="bg-primary px-16 py-6 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin inline mr-2" /> : 'Launch Instance Now'}
                            </button>
                            <button onClick={() => setStep(2)} className="text-white/40 font-bold">I need to change something</button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-4xl font-black mb-4">Deployment Initialized!</h2>
                        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto">
                            Your server is being provisioned on the selected node. This usually takes 10-30 seconds depending on the image size.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white text-black px-12 py-5 rounded-2xl font-black hover:bg-white/90 transition-all shadow-xl shadow-white/10"
                        >
                            Back to Dashboard
                        </button>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
