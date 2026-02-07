"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login Successful!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6 transition-transform hover:scale-110">
                        <Zap className="fill-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
                    <p className="text-white/40 text-sm mt-2">Enter your credentials to access AetherPanel</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-white/20"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Log In to Aether'}
                    </button>
                </form>

                <p className="text-center mt-8 text-white/20 text-xs text-balance">
                    Dont have an account? <Link href="/auth/register" className="text-primary font-bold hover:underline">Register now</Link>
                </p>
            </motion.div>
        </div>
    );
}
