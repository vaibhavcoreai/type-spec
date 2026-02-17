
import React from 'react';
import { Smartphone, Monitor, ChevronRight } from 'lucide-react';

const MobileGate: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[var(--bg)] flex items-center justify-center p-6 text-[var(--fg)]">
            {/* Decorative Corner Borders */}
            <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-[var(--accent)] opacity-50"></div>
            <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)] opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)] opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-[var(--accent)] opacity-50"></div>

            <div className="max-w-md w-full technical-border p-10 bg-[var(--surface)] float-shadow relative overflow-hidden">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative z-10 space-y-8 text-center">
                    <div className="flex justify-center items-center space-x-4">
                        <div className="relative">
                            <Smartphone size={40} className="text-[var(--muted)] opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-10 h-0.5 bg-red-500 rotate-45"></div>
                            </div>
                        </div>
                        <ChevronRight size={24} className="text-[var(--accent)] animate-pulse" />
                        <Monitor size={48} className="text-[var(--accent)]" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-dos text-2xl tracking-[0.2em] uppercase leading-tight">
                            Hardware_Mismatch
                        </h1>
                        <div className="w-12 h-0.5 bg-[var(--accent)] mx-auto"></div>
                        <p className="text-[10px] text-[var(--muted)] uppercase tracking-[0.3em] leading-relaxed">
                            Incompatible Input Method Detected. This Terminal requires a physical QWERTY Interface for operation.
                        </p>
                    </div>

                    <div className="p-4 border border-dashed border-[var(--border)] bg-[var(--bg)] space-y-2">
                        <div className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                            <span className="w-1 h-1 bg-[var(--accent)] rounded-full"></span>
                            <span>Requirement: Desktop_Console</span>
                            <span className="w-1 h-1 bg-[var(--accent)] rounded-full"></span>
                        </div>
                        <p className="text-[8px] text-[var(--muted)] uppercase tracking-tighter">
                            Mobile and Tablet devices are currently restricted. Please re-establish connection via Desktop or Laptop.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                        <div className="text-[8px] text-[var(--muted)] font-mono uppercase tracking-widest">
                            Error_Code: ERR_INTERFACE_TYPE_MOBILE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileGate;
