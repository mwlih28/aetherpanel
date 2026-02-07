"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsoleProps {
    logs: string[];
    onCommand: (cmd: string) => void;
}

export const Console = ({ logs, onCommand }: ConsoleProps) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        onCommand(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] glass rounded-3xl overflow-hidden border border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TerminalIcon size={18} className="text-primary" />
                    </div>
                    <span className="font-bold text-sm tracking-tight capitalize">Instance Terminal</span>
                </div>
                <div className="flex gap-1.5 opacity-30">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 font-mono text-[13px] space-y-1.5 bg-black/40 selection:bg-primary/30">
                {logs.length === 0 && (
                    <div className="text-white/20 italic">Waiting for logs...</div>
                )}
                {logs.map((log, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="text-white/70 break-all leading-relaxed"
                    >
                        <span className="text-primary/40 mr-3 select-none">❯</span>
                        {log}
                    </motion.div>
                ))}
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Send command to server..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all pr-14 placeholder:text-white/20"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1.5 p-3 text-primary hover:bg-primary/20 rounded-xl transition-all active:scale-90"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

