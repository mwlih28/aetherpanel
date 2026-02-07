"use client";

import React, { useState } from 'react';
import { Folder, File, Download, Trash2, Edit, ChevronRight, Upload, Plus, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileItem {
    name: string;
    isDirectory: boolean;
    size: number | null;
    mtime: Date;
}

interface FileManagerProps {
    files: FileItem[];
    path: string;
    onNavigate: (path: string) => void;
    onDelete: (name: string) => void;
    onSave: (name: string, content: string) => void;
    onEdit: (name: string) => void;
    isEditing?: { name: string, content: string } | null;
    onCancelEdit: () => void;
}

export const FileManager = ({ files, path, onNavigate, onDelete, onSave, onEdit, isEditing, onCancelEdit }: FileManagerProps) => {
    const [editContent, setEditContent] = useState('');

    React.useEffect(() => {
        if (isEditing) setEditContent(isEditing.content);
    }, [isEditing]);

    return (
        <div className="glass rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.01]">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto">
                    <button onClick={() => onNavigate('/')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <Folder className="text-primary" size={20} />
                    </button>
                    <ChevronRight size={14} className="text-white/20" />
                    <span className="text-sm font-bold tracking-tight text-white/40 truncate">/root{path}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <Upload size={14} /> Upload
                    </button>
                    <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        <Plus size={14} /> New File
                    </button>
                </div>
            </div>

            <div className="divide-y divide-white/[0.03]">
                {files.length === 0 && (
                    <div className="p-20 text-center text-white/20 italic">This directory is empty</div>
                )}
                {files.map((file, i) => (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={i}
                        className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all group"
                    >
                        <div
                            className="flex items-center gap-4 flex-1 cursor-pointer"
                            onClick={() => file.isDirectory ? onNavigate(`${path}/${file.name}`) : onEdit(file.name)}
                        >
                            <div className={`p-3 rounded-2xl ${file.isDirectory ? 'bg-primary/10 text-primary' : 'bg-white/5 text-white/40'}`}>
                                {file.isDirectory ? <Folder size={20} /> : <File size={20} />}
                            </div>
                            <div>
                                <p className="text-sm font-bold group-hover:text-primary transition-colors">{file.name}</p>
                                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                                    {file.isDirectory ? 'Directory' : `${(file.size! / 1024).toFixed(1)} KB`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button onClick={() => onEdit(file.name)} className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => onDelete(file.name)} className="p-2.5 hover:bg-rose-500/10 rounded-xl text-rose-500 transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Simple Editor Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg"><Edit className="text-primary" size={18} /></div>
                                    <span className="font-bold">Editing: {isEditing.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onSave(isEditing.name, editContent)}
                                        className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                    <button onClick={onCancelEdit} className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 transition-all">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full h-[60vh] bg-transparent p-8 font-mono text-sm focus:outline-none resize-none text-white/80"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

