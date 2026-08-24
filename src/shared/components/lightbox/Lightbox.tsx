import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LightboxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageUrl: string;
    alt?: string;
}

const Lightbox: React.FC<LightboxProps> = ({ open, onOpenChange, imageUrl, alt = 'Image' }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Reset state when opened or closed
    useEffect(() => {
        if (open) {
            setScale(1);
            setRotation(0);
        }
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };
        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
    const handleRotateLeft = () => setRotation(prev => prev - 90);
    const handleRotateRight = () => setRotation(prev => prev + 90);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10 bg-black/50 p-2 rounded-2xl backdrop-blur-md">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleZoomOut}>
                    <ZoomOut className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleZoomIn}>
                    <ZoomIn className="w-5 h-5" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleRotateLeft}>
                    <RotateCcw className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleRotateRight}>
                    <RotateCw className="w-5 h-5" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-rose-500/80" onClick={() => onOpenChange(false)}>
                    <X className="w-6 h-6" />
                </Button>
            </div>

            {/* Image Container */}
            <div 
                className="relative w-full h-full flex items-center justify-center p-4 overflow-auto cursor-move"
                onClick={() => onOpenChange(false)}
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default Lightbox;
