"use client";

import React, { useState } from 'react';
import { Search, Download, CheckCircle2, Box, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PluginMarketplace = ({ plugins, onInstall, onSearch, loading }: { plugins: any[], onInstall: (p: any) => void, onSearch: (q: string) => void, loading?: boolean }) => {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(search);
    };

    return (
        <div className="flex flex-col gap-8">
            <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-6 top-5 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search thousands of plugins & mods via Modrinth..."
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-16 py-5 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-xl shadow-black/20"
                />
                <button
                    type="submit"
                    className="absolute right-4 top-2 bottom-2 px-6 bg-primary rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
                >
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-40">
                            <Loader2 className="animate-spin text-primary mb-4" size={32} />
                            <p className="font-bold tracking-widest text-xs uppercase">Polling Repository...</p>
                        </div>
                    ) : plugins.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-white/20">
                            <Box size={40} className="mx-auto mb-4" />
                            <p className="font-bold">No results found for "{search}"</p>
                        </div>
                    ) : plugins.map((plugin, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 glass rounded-[2rem] border border-white/5 flex flex-col gap-5 group hover:border-primary/30 transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-gradient-to-tr from-white/5 to-white/[0.02] rounded-2xl flex-shrink-0 flex items-center justify-center text-white/20 group-hover:from-primary/20 group-hover:to-primary/5 group-hover:text-primary transition-all duration-500">
                                    <Box size={28} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                                    {plugin.author || 'Community'}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h4 className="font-black text-lg truncate mb-2">{plugin.title}</h4>
                                <p className="text-sm text-white/40 line-clamp-2 leading-relaxed h-10">
                                    {plugin.description}
                                </p>
                            </div>

                            <button
                                onClick={() => onInstall(plugin)}
                                className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-white/5 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-primary/20"
                            >
                                <Download size={18} />
                                Install Plugin
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

