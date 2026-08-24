// components/DigitalSignatureInput.tsx
import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DigitalSignatureInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    height?: number;
    strokeColor?: string;
    supportClear?: boolean;
};

export const DigitalSignatureInput: React.FC<DigitalSignatureInputProps> = ({
    value,
    onChange,
    disabled = false,
    className,
    height = 200,
    strokeColor = "#000",
    supportClear = true,
}) => {
    const sigCanvasRef = useRef<SignatureCanvas | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value && sigCanvasRef.current && sigCanvasRef.current.isEmpty()) {
            const img = new Image();
            img.src = value;
            img.onload = () => {
                const canvas = sigCanvasRef.current?.getCanvas();
                const ctx = canvas?.getContext("2d");
                if (canvas && ctx) {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            };
        }
    }, [value]);

    const handleEnd = () => {
        if (sigCanvasRef.current && onChange) {
            const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
            onChange(dataUrl);
        }
    };

    const handleClear = () => {
        sigCanvasRef.current?.clear();
        onChange?.("");
    };

    return (
        <div className={cn("border rounded p-4", className)}>
            <div
                ref={wrapperRef}
                className="relative border bg-white overflow-hidden rounded"
                style={{ height }}
            >
                <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor={strokeColor}
                    onEnd={handleEnd}
                    backgroundColor="rgba(255, 255, 255, 1)"
                    canvasProps={{
                        className: cn("w-full h-full", disabled && "pointer-events-none opacity-70"),
                    }}
                />
            </div>
            {supportClear && (
                <div className="mt-2 flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={disabled}>
                        Clear
                    </Button>
                </div>
            )}
        </div>
    );
};
