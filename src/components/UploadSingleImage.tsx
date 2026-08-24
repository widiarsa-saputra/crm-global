import React, { useCallback, useState, useEffect, useId } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useUploadFile } from '@/services/file/hooks/useUploadFile';
import { toast } from 'sonner';

interface UploadSingleImageProps {
    value?: string | number | null;
    onChange: (id: string | null) => void;
    previewUrl?: string | null;
    error?: string;
}

export const UploadSingleImage: React.FC<UploadSingleImageProps> = ({ onChange, previewUrl, error }) => {
    const inputId = useId();
    const [isDragging, setIsDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);
    const uploadMutation = useUploadFile();

    useEffect(() => {
        if (!localPreview && previewUrl) {
            setLocalPreview(previewUrl);
        }
    }, [previewUrl]);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('File yang diunggah harus berupa gambar.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);

        try {
            const res = await uploadMutation.mutateAsync({
                file,
                title: file.name
            });
            if (res.data && res.data.id) {
                onChange(res.data.id);
            }
        } catch (err) {
            toast.error('Gagal mengunggah gambar.');
            console.error(err)
            setLocalPreview(previewUrl || null); // revert
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, []);

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        setLocalPreview(null);
        onChange(null);
    };

    return (
        <div className="flex flex-col h-full w-full relative group space-y-2">
            {/* {label && (
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {label}
                </label>
            )} */}
            <div
                className={`relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded transition-all h-full min-h-[200px] ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : error 
                            ? 'border-red-400 bg-red-50/50' 
                            : 'border-slate-200 bg-slate-50/30 hover:bg-white hover:border-slate-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {localPreview ? (
                    <div className="absolute inset-1 rounded flex items-center justify-center bg-black/5 overflow-hidden group/img p-1">
                        <img src={localPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                        
                        {uploadMutation.isPending && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                            </div>
                        )}

                        {!uploadMutation.isPending && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-600 mb-1 font-medium">
                            Tarik & lepas gambar ke sini
                        </p>
                        <p className="text-xs text-slate-400 mb-6">
                            atau klik tombol di bawah
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={inputId}
                            disabled={uploadMutation.isPending}
                        />
                        <label htmlFor={inputId}>
                            <span className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                {uploadMutation.isPending ? 'Mengunggah...' : 'Pilih Gambar'}
                            </span>
                        </label>
                    </>
                )}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>}
        </div>
    );
};
