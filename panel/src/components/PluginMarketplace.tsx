"use client";

import React, { useState } from 'react';
import { Search, Download, CheckCircle2, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export const PluginMarketplace = ({ plugins, onInstall }: { plugins: any[], onInstall: (p: any) => void }) => {
    const [search, setSearch] = useState('');

    return (
        <div className="flex flex-col gap-6">
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for plugins or mods..."
                    className="w-full bg-card/50 border border-border/50 rounded-2xl px-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {plugins.map((plugin, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 glass rounded-3xl flex gap-4 items-start group hover:border-primary/30 transition-all"
                    >
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Box size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{plugin.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                {plugin.description}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[10px] bg-muted px-2 py-1 rounded-full font-bold uppercase tracking-wider text-muted-foreground">
                                    {plugin.author}
                                </span>
                                <button
                                    onClick={() => onInstall(plugin)}
                                    className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    <Download size={14} />
                                    Install
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
