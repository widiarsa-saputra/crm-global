import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Upload, Loader2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

import useDownloadImportTemplate from '@/services/user';
import usePreviewUserImport from '@/services/user';
import useImportUsers from '@/services/user';

interface ImportUserModalProps {
    onSuccess?: () => void;
}

const ImportUserModal: React.FC<ImportUserModalProps> = ({ onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const downloadTemplate = useDownloadImportTemplate();
    const previewImport = usePreviewUserImport();
    const importUsers = useImportUsers();

    const handleDownloadTemplate = async () => {
        try {
            await downloadTemplate.mutateAsync();
        } catch (error) {
            toast.error("Gagal mengunduh template");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        try {
            const result = await previewImport.mutateAsync({ file });
            setPreviewData(result);
            toast("Analysis Complete", {
                description: `File ${file.name} telah berhasil dianalisis.`,
            });
        } catch (error) {
            toast.error("Analysis Failed", {
                description: "Sistem tidak dapat membaca format file tersebut.",
            });
            setSelectedFile(null);
        }
    };

    const handleConfirmImport = async () => {
        const token = previewData?.data?.preview_token;
        if (!token) {
            toast.error("Token tidak ditemukan", {
                description: "Sesi preview telah kadaluarsa atau tidak valid.",
            });
            return;
        }

        try {
            await importUsers.mutateAsync({ preview_token: token });
            toast("Import Success", {
                description: "Sinkronisasi data pengguna telah selesai dilakukan.",
            });
            setOpen(false);
            setPreviewData(null);
            setSelectedFile(null);
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Import Failed", {
                description: "Proses sinkronisasi data terhenti karena kesalahan teknis.",
            });
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setPreviewData(null);
            setSelectedFile(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 border-slate-200">
                    <Upload className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Import User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-falala-navy text-white">
                    <DialogTitle className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import Users
                    </DialogTitle>
                    <DialogDescription className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                        Unggah data pengguna secara massal via Excel
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    {!previewData ? (
                        <div className="space-y-4">
                            <div className="p-3 bg-amber-50 rounded border border-amber-100 flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-700">Aturan Upsert</h5>
                                    <p className="text-[9px] text-amber-600 font-bold uppercase leading-relaxed">
                                        Sistem mencocokkan data berdasarkan **email**. Email baru akan didaftarkan, email yang sudah ada akan diperbarui datanya.
                                    </p>
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                onClick={handleDownloadTemplate}
                                disabled={downloadTemplate.isPending}
                                className="w-full h-8 text-[9px] font-black uppercase tracking-widest rounded border-slate-200 text-slate-500 italic bg-slate-50/50 hover:bg-white gap-2 shadow-none"
                            >
                                {downloadTemplate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                Unduh Template Impor (.xlsx)
                            </Button>

                            <div className="relative group">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    disabled={previewImport.isPending}
                                />
                                <div className={`border-2 border-dashed ${previewImport.isPending ? 'bg-slate-50 border-slate-200' : 'border-slate-100 bg-slate-50/30 group-hover:bg-white group-hover:border-falala-navy/30'} rounded-lg p-10 flex flex-col items-center justify-center gap-3 transition-all text-center`}>
                                    {previewImport.isPending ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-falala-navy/20" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            {previewImport.isPending ? 'Menganalisis file...' : 'Pilih File Excel'}
                                        </p>
                                        <p className="text-[8px] font-bold text-slate-300 uppercase">Max size: 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="p-4 bg-emerald-50 rounded border border-emerald-100 space-y-3 shadow-inner">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-emerald-600" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic">Preview: {selectedFile?.name}</h5>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white p-2 rounded border border-emerald-100/50 text-center shadow-sm">
                                        <p className="text-[16px] font-black text-emerald-600 leading-none">{previewData.data?.will_create || 0}</p>
                                        <p className="text-[8px] font-black uppercase text-emerald-500 mt-1">Baru</p>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-emerald-100/50 text-center shadow-sm">
                                        <p className="text-[16px] font-black text-blue-600 leading-none">{previewData.data?.will_update || 0}</p>
                                        <p className="text-[8px] font-black uppercase text-blue-500 mt-1">Update</p>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-emerald-100/50 text-center shadow-sm">
                                        <p className="text-[16px] font-black text-rose-600 leading-none">{previewData.data?.failed || 0}</p>
                                        <p className="text-[8px] font-black uppercase text-rose-500 mt-1">Error</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => { setPreviewData(null); setSelectedFile(null); }}
                                    className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest text-slate-400"
                                >
                                    Ulangi
                                </Button>
                                <Button 
                                    onClick={handleConfirmImport}
                                    disabled={importUsers.isPending}
                                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white h-10 text-[10px] font-black uppercase tracking-widest rounded shadow-md gap-2"
                                >
                                    {importUsers.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                    Konfirmasi Impor
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 bg-slate-50 flex items-center justify-center border-t">
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">FALALA SYSTEM CONTROL v1.0</p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportUserModal;
