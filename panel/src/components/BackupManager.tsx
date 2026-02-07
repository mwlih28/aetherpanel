"use client";

import React from 'react';
import { Database, Plus, Download, Trash2, Clock } from 'lucide-react';

export const BackupManager = ({ backups }: { backups: any[] }) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold">Data Backups</h3>
                    <p className="text-sm text-muted-foreground">Manage your instance restore points.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                    <Plus size={18} />
                    Create Backup
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {backups.map((backup, i) => (
                    <div key={i} className="p-4 glass rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground">
                                <Database size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{backup.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock size={12} className="text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground font-medium">Created {backup.date}</span>
                                    <span className="text-[10px] text-primary font-bold">{(backup.size / 1024 / 1024).toFixed(1)} MB</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                                <Download size={18} />
                            </button>
                            <button className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {backups.length === 0 && (
                    <div className="p-10 border-2 border-dashed border-border/30 rounded-3xl flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <Database size={32} strokeWidth={1} />
                        <p className="text-sm font-medium">No backups found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
