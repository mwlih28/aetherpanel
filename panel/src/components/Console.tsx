"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const Console = ({ logs }: { logs: string[] }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-[500px] glass rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                    <TerminalIcon size={18} className="text-primary" />
                    <span className="font-bold text-sm tracking-tight capitalize">Instance Console</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-1 bg-black/40">
                {logs.map((log, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="text-muted-foreground break-all"
                    >
                        <span className="text-primary/50 mr-2">❯</span>
                        {log}
                    </motion.div>
                ))}
            </div>

            <div className="p-4 bg-muted/30 border-t border-border/50">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a command..."
                        className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-12"
                    />
                    <button className="absolute right-2 top-1.5 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
