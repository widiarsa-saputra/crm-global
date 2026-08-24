import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const ForbiddenPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full text-center">
                {/* Icon Container */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-red-50">
                            <ShieldAlert className="h-16 w-16 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-6xl font-black text-falala-navy mb-2 tracking-tighter italic">403</h1>
                <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-tight">Akses Dibatasi</h2>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                    Maaf, akun Anda tidak memiliki izin yang cukup untuk mengakses halaman ini.
                    Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="h-12 px-8 rounded border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-widest hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <Button
                        onClick={() => navigate("/")}
                        className="h-12 px-8 rounded bg-falala-navy text-white font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-falala-navy/20 hover:bg-slate-900 transition-all"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Halaman Utama
                    </Button>
                </div>

                {/* Footer Decor */}
                <div className="mt-16 pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
                        Falala Chocolate Bali &bull; Security System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForbiddenPage;