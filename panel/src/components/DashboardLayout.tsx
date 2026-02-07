"use client";

import React from 'react';
import { LayoutDashboard, Server, Shield, Users, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
    <motion.div
        whileHover={{ x: 4 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </motion.div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border p-6 flex flex-col gap-8 bg-card/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Aetherpanel</h1>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarItem icon={Server} label="Instances" />
                    <SidebarItem icon={Users} label="Users" />
                    <SidebarItem icon={Settings} label="System Settings" />
                </nav>

                <div className="mt-auto border-t border-border pt-6">
                    <SidebarItem icon={LogOut} label="Sign Out" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-background to-muted/20">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold">Welcome back, Admin</h2>
                        <p className="text-muted-foreground mt-1">Manage your high-performance nodes and instances.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                            Create Instance
                        </button>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
