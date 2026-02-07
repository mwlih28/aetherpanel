"use client";

import React from 'react';
import { Folder, File, MoreVertical, Download, Trash2, Edit } from 'lucide-react';

interface FileItem {
    name: string;
    isDirectory: boolean;
    size: number | null;
    mtime: Date;
}

export const FileManager = ({ files }: { files: FileItem[] }) => {
    return (
        <div className="glass rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-muted/10 font-bold text-sm flex justify-between items-center">
                <span>File Manager</span>
                <span className="text-xs text-muted-foreground font-normal">Root Directory</span>
            </div>

            <div className="divide-y divide-border/30">
                {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-4">
                            {file.isDirectory ? (
                                <Folder className="text-primary fill-primary/10" size={20} />
                            ) : (
                                <File className="text-muted-foreground" size={20} />
                            )}
                            <div>
                                <p className="text-sm font-semibold">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold">
                                    {file.isDirectory ? 'Directory' : `${(file.size! / 1024).toFixed(1)} KB`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                                <Edit size={16} />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
                                <Download size={16} />
                            </button>
                            <button className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
