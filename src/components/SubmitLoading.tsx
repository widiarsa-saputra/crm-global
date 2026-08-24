/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, positionClass } from "@/lib/utils";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { UseMutationResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PulseDots = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return "";
                return prev + ".";
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return <span>{dots}</span>;
};

type Props = Pick<PopoverContentProps, 'side' | 'align'> & {
    mutation: UseMutationResult;
    errorMessage?: string;
    successMessage?: string;
    duration?: number;
}


export const SubmitLoading = (props: Props) => {
    const [openLoading, setOpenLoading] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const beforeStop = 75;
    const movingDuration = 200;

    const [targetProgress, setTargetProgress] = useState({
        message: 'Mempersiapkan data',
        value: 0
    });

    const [progress, setProgress] = useState({
        message: 'Mempersiapkan data',
        value: 0
    });

    const [closeToastProg, setCloseToastProg] = useState(100);

    useEffect(() => {
        let animationFrame: number;

        if (openToast) {
            const duration = props.duration || 5000;
            const start = performance.now();

            const animate = (now: number) => {
                const elapsed = now - start;
                const percentage = Math.min(elapsed / duration, 1);

                setCloseToastProg(100 - percentage * 100);

                if (percentage < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setOpenToast(false);
                    setCloseToastProg(100);
                }
            };

            animationFrame = requestAnimationFrame(animate);
        } else {
            setCloseToastProg(100);
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [openToast]);

    useEffect(() => {
        if (props.mutation) {
            if (props.mutation.isPending) {
                setOpenLoading(true);
                setOpenToast(false);
                setTargetProgress({ message: 'Mengirim data', value: 25 });
            } else if (props.mutation.isSuccess) {
                setTargetProgress({ message: 'Proses berhasil!', value: beforeStop });
            } else if (props.mutation.isError) {
                setTargetProgress({ message: 'Proses gagal!', value: beforeStop });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mutation?.isPending, props.mutation?.isSuccess, props.mutation?.isError]);

    useEffect(() => {
        if (progress.value === targetProgress.value) {
            setProgress(prev => ({ ...prev, message: targetProgress.message }));
            return;
        }

        const startValue = progress.value;
        const endValue = targetProgress.value;
        const duration = movingDuration;
        const startTime = performance.now();

        let animationFrame: number;

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const percentage = Math.min(elapsed / duration, 1);

            setProgress({
                message: targetProgress.message,
                value: startValue + (endValue - startValue) * percentage
            });

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [targetProgress]);

    useEffect(() => {
        if (progress.value !== beforeStop && progress.value !== 100) {
            return;
        }

        const timer = setTimeout(() => {
            if (progress.value === beforeStop) {
                setTargetProgress({
                    message: "Proses selesai",
                    value: 100,
                });

                return;
            }

            if (progress.value === 100) {
                setOpenLoading(false);
                setProgress({
                    message: 'Mempersiapkan data',
                    value: 0
                });
                setTargetProgress({
                    message: 'Mempersiapkan data',
                    value: 0
                });
                setOpenToast(true);
            }
        }, movingDuration);

        return () => clearTimeout(timer);
    }, [progress.value]);

    return (
        <>
            {openLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 text-primary-foreground">
                    <div className="w-[20vw] flex flex-col items-center justify-center gap-4 relative">
                        <div className={cn(
                            "h-20 w-20 animate-spin border-primary-foreground/30 rounded-full border-12 !border-t-primary-foreground border-t-12"
                        )} />
                        <p className="text-center flex gap-1">
                            <span>
                                {progress.message}
                            </span>
                            {
                                !(props.mutation.isError || props.mutation.isSuccess) && (
                                    <PulseDots />
                                )
                            }
                        </p>
                        <div className={cn(
                            "h-2 self-start flex rounded-l-full justify-end absolute -bottom-4",
                            progress.value === 100 ? 'rounded-r-full' : '',
                            props.mutation?.isSuccess
                                ? 'bg-green-500'
                                : props.mutation?.isError
                                    ? 'bg-red-500'
                                    : 'bg-primary-foreground'
                        )} style={{ width: `${progress.value}%` }} >
                            <div className="h-3 w-[1px] bg-primary-foreground relative">
                                <span className="absolute -bottom-6 translate-x-1/2 right-1/2">
                                    {Math.round(progress.value)}%
                                </span>
                            </div>

                        </div>

                        <div className="bg-primary-foreground/10 rounded-full h-2 self-start flex justify-end absolute -bottom-4 w-full">
                        </div>
                    </div>
                </div>
            )}

            {createPortal(
                <AnimatePresence>
                    {openToast && (
                        <div className="inset-0 fixed z-50 pointer-events-none">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: '100%'
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    x: '100%'
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                                className={cn(
                                    "w-64 rounded-lg absolute px-4 py-2 pointer-events-auto",
                                    props.mutation?.status === 'success'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-red-500 text-white',
                                    positionClass[props.side ?? "top"][props.align ?? "end"]
                                )}
                            >
                                {props.mutation?.status === 'success'
                                    ? (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-1 rounded-lg flex items-center justify-center h-6 w-6 bg-white text-green-600">
                                                <Check size={16} strokeWidth={4} />
                                            </div>
                                            <div className="flex flex-col ">
                                                <h1 className="font-semibold text-sm">
                                                    Success!
                                                </h1>
                                                <p className="text-xs">
                                                    {props.successMessage ?? 'Proses berhasil!'}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                    : (
                                        <div className="flex gap-2 items-center">
                                            <div className="p-1 rounded-lg flex items-center justify-center h-6 w-6 bg-white text-red-600">
                                                <X size={16} strokeWidth={4} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h1 className="font-semibold text-sm">
                                                    Failed!
                                                </h1>
                                                <p className="text-xs">
                                                    {props.errorMessage ?? 'Proses gagal!'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                <button className="absolute top-1 right-1 fade-in transition-all duration-3000 animate-in" onClick={() => setOpenToast(false)}>
                                    <X size={16} />
                                </button>

                                <div className="bg-primary-foreground/10 w-full h-[2px] mt-2 flex justify-end">
                                    <div className="h-full bg-white" style={{
                                        width: `${closeToastProg}%`
                                    }} ></div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}