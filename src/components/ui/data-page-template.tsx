import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { BaseTable, Column } from '@/shared/components/table/BaseTable';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import { Modal } from '@/shared/components/modal/Modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm, UseFormReturn, FieldValues, Resolver, DefaultValues } from 'react-hook-form';
import { cn, positionClass } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Badge } from './badge';

// ─── Internal: MutationFeedback ───────────────────────────────────────────────

interface MutationState {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    status: 'idle' | 'pending' | 'success' | 'error';
}

const PulseDots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);
        return () => clearInterval(interval);
    }, []);
    return <span>{dots}</span>;
};

interface MutationFeedbackProps extends MutationState {
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    successMessage?: string;
    errorMessage?: string;
    duration?: number;
}

const MutationFeedback: React.FC<MutationFeedbackProps> = (props) => {
    const { isPending, isSuccess, isError, status, side = 'top', align = 'end', duration = 5000, successMessage, errorMessage } = props;
    const beforeStop = 75;
    const movingDuration = 200;

    const [openLoading, setOpenLoading] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [closeToastProg, setCloseToastProg] = useState(100);
    const [targetProgress, setTargetProgress] = useState({ message: 'Mempersiapkan data', value: 0 });
    const [progress, setProgress] = useState({ message: 'Mempersiapkan data', value: 0 });

    // Toast countdown
    useEffect(() => {
        let animationFrame: number;
        if (openToast) {
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
        return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
    }, [openToast, duration]);

    // Track mutation state changes
    useEffect(() => {
        if (isPending) {
            setOpenLoading(true);
            setOpenToast(false);
            setTargetProgress({ message: 'Mengirim data', value: 25 });
        } else if (isSuccess) {
            setTargetProgress({ message: 'Proses berhasil!', value: beforeStop });
        } else if (isError) {
            setTargetProgress({ message: 'Proses gagal!', value: beforeStop });
        }
    }, [isPending, isSuccess, isError]);

    // Animate progress bar
    useEffect(() => {
        if (progress.value === targetProgress.value) {
            setProgress(prev => ({ ...prev, message: targetProgress.message }));
            return;
        }
        const startValue = progress.value;
        const endValue = targetProgress.value;
        const startTime = performance.now();
        let animationFrame: number;
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const percentage = Math.min(elapsed / movingDuration, 1);
            setProgress({ message: targetProgress.message, value: startValue + (endValue - startValue) * percentage });
            if (percentage < 1) animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [targetProgress]);

    // Trigger completion
    useEffect(() => {
        if (progress.value !== beforeStop && progress.value !== 100) return;
        const timer = setTimeout(() => {
            if (progress.value === beforeStop) {
                setTargetProgress({ message: 'Proses selesai', value: 100 });
            } else if (progress.value === 100) {
                setOpenLoading(false);
                setProgress({ message: 'Mempersiapkan data', value: 0 });
                setTargetProgress({ message: 'Mempersiapkan data', value: 0 });
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
                        <div className="h-20 w-20 animate-spin border-primary-foreground/30 rounded-full border-12 !border-t-primary-foreground border-t-12" />
                        <p className="text-center flex gap-1">
                            <span>{progress.message}</span>
                            {!(isError || isSuccess) && <PulseDots />}
                        </p>
                        <div
                            className={cn(
                                'h-2 self-start flex rounded-l-full justify-end absolute -bottom-4',
                                progress.value === 100 ? 'rounded-r-full' : '',
                                isSuccess ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-primary-foreground'
                            )}
                            style={{ width: `${progress.value}%` }}
                        >
                            <div className="h-3 w-[1px] bg-primary-foreground relative">
                                <span className="absolute -bottom-6 translate-x-1/2 right-1/2">{Math.round(progress.value)}%</span>
                            </div>
                        </div>
                        <div className="bg-primary-foreground/10 rounded-full h-2 self-start flex justify-end absolute -bottom-4 w-full" />
                    </div>
                </div>
            )}

            {createPortal(
                <AnimatePresence>
                    {openToast && (
                        <div className="inset-0 fixed z-50 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className={cn(
                                    'w-64 rounded-lg absolute px-4 py-2 pointer-events-auto',
                                    status === 'success' ? 'bg-primary text-primary-foreground' : 'bg-red-500 text-white',
                                    positionClass[side][align]
                                )}
                            >
                                {status === 'success' ? (
                                    <div className="flex gap-2 items-center">
                                        <div className="p-1 rounded-lg flex items-center justify-center h-6 w-6 bg-white text-green-600">
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-sm">Success!</h1>
                                            <p className="text-xs">{successMessage ?? 'Proses berhasil!'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 items-center">
                                        <div className="p-1 rounded-lg flex items-center justify-center h-6 w-6 bg-white text-red-600">
                                            <X size={16} strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-sm">Failed!</h1>
                                            <p className="text-xs">{errorMessage ?? 'Proses gagal!'}</p>
                                        </div>
                                    </div>
                                )}
                                <button className="absolute top-1 right-1 fade-in transition-all duration-3000 animate-in" onClick={() => setOpenToast(false)}>
                                    <X size={16} />
                                </button>
                                <div className="bg-primary-foreground/10 w-full h-[2px] mt-2 flex justify-end">
                                    <div className="h-full bg-white" style={{ width: `${closeToastProg}%` }} />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

// ─── Internal: ManagedForm ────────────────────────────────────────────────────
// Renders the mutationForm component inside a managed useForm instance.
// Separated into its own component so useForm is only called when needed.

interface ManagedFormProps<TData extends FieldValues> {
    formComponent: React.ComponentType<{ form: UseFormReturn<TData> }>;
    resolver: Resolver<TData>;
    defaultValues: TData;
    onConfirm: (data: TData) => Promise<void>;
    onDone: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    onCancel?: () => void;
    mutationMode?: 'modal' | 'content';
    headerActionsNode?: HTMLElement | null;
    setGlobalMutationState?: (state: MutationState) => void;
}

function ManagedForm<TData extends FieldValues>({
    formComponent: FormComponent,
    resolver,
    defaultValues,
    onConfirm,
    onDone,
    submitLabel = 'Simpan',
    cancelLabel,
    onCancel,
    mutationMode,
    headerActionsNode,
    setGlobalMutationState,
}: ManagedFormProps<TData>) {
    const form = useForm<TData>({ resolver, defaultValues: defaultValues as DefaultValues<TData> });
    const [mutationState, setMutationState] = useState<MutationState>({
        isPending: false,
        isSuccess: false,
        isError: false,
        status: 'idle',
    });

    const handleSubmit = form.handleSubmit(async (data) => {
        setMutationState({ isPending: true, isSuccess: false, isError: false, status: 'pending' });
        if (setGlobalMutationState) setGlobalMutationState({ isPending: true, isSuccess: false, isError: false, status: 'pending' });
        try {
            await onConfirm(data as TData);
            setMutationState({ isPending: false, isSuccess: true, isError: false, status: 'success' });
            if (setGlobalMutationState) setGlobalMutationState({ isPending: false, isSuccess: true, isError: false, status: 'success' });
            form.reset();
            onDone();
        } catch {
            setMutationState({ isPending: false, isSuccess: false, isError: true, status: 'error' });
            if (setGlobalMutationState) setGlobalMutationState({ isPending: false, isSuccess: false, isError: true, status: 'error' });
        }
    });

    return (
        <>
            {/* Pass form to the field-only component */}
            <FormComponent form={form as unknown as UseFormReturn<TData>} />

            {/* Footer: cancel + submit */}
            {mutationMode === 'content' ? (
                headerActionsNode ? createPortal(
                    <>
                        {onCancel && (
                            <Button variant="outline" type="button" onClick={onCancel} disabled={mutationState.isPending}>
                                {cancelLabel ?? 'Batal'}
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={mutationState.isPending}
                        >
                            {mutationState.isPending ? 'Menyimpan...' : submitLabel}
                        </Button>
                    </>,
                    headerActionsNode
                ) : null
            ) : (
                <div className="flex justify-end gap-2 pt-4">
                    {onCancel && (
                        <Button variant="outline" type="button" onClick={onCancel} disabled={mutationState.isPending}>
                            {cancelLabel ?? 'Batal'}
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={mutationState.isPending}
                    >
                        {mutationState.isPending ? 'Menyimpan...' : submitLabel}
                    </Button>
                </div>
            )}
        </>
    );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MutationMode = 'modal' | 'content';

export interface AdditionalAction<T> {
    icon: React.ReactNode;
    onClick: (item: T) => void;
    className?: string;
    tooltip?: string;
}

export interface AddAction<TData extends FieldValues = FieldValues> {
    /** Label for the add button. Defaults to "Tambah {title}" */
    label?: string;
    modalTitle?: string;
    modalDescription?: string;
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Content-mode only */
    contentTitle?: string;
    contentDescription?: string;
    /**
     * Legacy: render function for the add form. Use `onConfirm` + `mutationForm` instead.
     * Template passes `onSuccess` — call it after a successful mutation to close the modal/view.
     */
    component?: (onSuccess: () => void) => React.ReactNode;
    /**
     * Called with validated form data when the user submits.
     * Use together with `mutationForm` on DataPageTemplateProps.
     */
    onConfirm?: (data: TData) => Promise<void>;
}

export interface EditAction<T, TData extends FieldValues = FieldValues> {
    modalTitle?: string | ((item: T) => string);
    modalDescription?: string | ((item: T) => string);
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Content-mode only */
    contentTitle?: string | ((item: T) => string);
    contentDescription?: string | ((item: T) => string);
    /**
     * Legacy: render function for the edit form. Use `onConfirm` + `mutationForm` instead.
     * Template passes the selected `item` and `onBack`.
     */
    component?: (item: T, onBack: () => void) => React.ReactNode;
    /**
     * Called with the selected item and validated form data when the user submits.
     * Use together with `mutationForm` on DataPageTemplateProps.
     */
    onConfirm?: (item: T, data: TData) => Promise<void>;
}

export interface DeleteAction<T> {
    /**
     * Legacy: render function for a custom delete confirmation UI.
     * When provided, the built-in AlertDialog is skipped entirely.
     */
    component?: (item: T, open: boolean, onOpenChange: (open: boolean) => void) => React.ReactNode;
    /** AlertDialog title. Defaults to "Hapus Data?" */
    title?: string | ((item: T) => string);
    /** AlertDialog description. Defaults to generic message */
    description?: string | ((item: T) => string);
    /** Confirm button label. Defaults to "Hapus" */
    confirmLabel?: string;
    /** The actual delete function to call */
    onConfirm?: (item: T) => Promise<void>;
}

export interface SubmitActions<T, TData extends FieldValues = FieldValues> {
    add?: AddAction<TData>;
    edit?: EditAction<T, TData>;
    delete?: DeleteAction<T>;
}

/**
 * A single form component + config that the template uses to render both add and edit forms.
 * `TData` must match the form's field values type (inferred from `component`).
 */
export interface MutationForm<T, TData extends FieldValues> {
    /** The field-only form component. Must accept `{ form: UseFormReturn<TData> }`. */
    component: React.ComponentType<{ form: UseFormReturn<TData> }>;
    /** react-hook-form resolver (e.g. zodResolver(YourSchema)) */
    resolver: Resolver<TData>;
    /** Default values for the add form (empty state) */
    emptyValues: TData;
    /** Map an existing entity to form values for the edit form */
    defaultValues: (item: T) => TData;
}


export interface DataPageTemplateProps<
    T extends { id?: string | number },
    TData extends FieldValues = FieldValues
> {
    title: string;
    description?: string;
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    enableColumnToggle?: boolean;
    totalItems?: number;
    currentPage?: number;
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
    onItemsPerPageChange?: (items: number) => void;
    /** 'modal' opens mutation UI in a Dialog. 'content' replaces the page. Default: 'modal' */
    mutationMode?: MutationMode;
    submitActions?: SubmitActions<T, TData>;
    additionalActions?: AdditionalAction<T>[];
    /**
     * Single form component used for both add and edit.
     * When provided alongside `submitActions.add.onConfirm` / `submitActions.edit.onConfirm`,
     * the template manages useForm, defaultValues, submit button, and feedback internally.
     */
    mutationForm?: MutationForm<T, TData>;
    filterLabels?: string[];
    handleSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc' | null;
    /** Function to render a custom grid item instead of a table row. Receives the item and its pre-rendered actions. */
    gridRenderItem?: (item: T, actionsNode: React.ReactNode) => React.ReactNode;
    /** Custom class for the grid container. Default: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' */
    gridClassName?: string;
}

// ─── Internal state ───────────────────────────────────────────────────────────

type ViewState = 'list' | 'add' | 'edit';

function resolve<T, R extends string | undefined>(value: R | ((item: T) => R) | undefined, item: T): R | undefined {
    if (typeof value === 'function') return (value as (item: T) => R)(item);
    return value;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataPageTemplate<
    T extends { id?: string | number },
    TData extends FieldValues = FieldValues
>({
    title,
    description,
    columns,
    data,
    isLoading,
    enableColumnToggle,
    totalItems = 0,
    currentPage = 1,
    itemsPerPage = 10,
    onPageChange,
    onItemsPerPageChange,
    mutationMode = 'modal',
    submitActions,
    additionalActions,
    mutationForm,
    filterLabels,
    handleSort,
    sortBy,
    sortOrder,
    gridRenderItem,
    gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
}: DataPageTemplateProps<T, TData>) {
    const [view, setView] = useState<ViewState>('list');
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [globalMutationState, setGlobalMutationState] = useState<MutationState>({
        isPending: false, isSuccess: false, isError: false, status: 'idle',
    });
    const [headerActionsNode, setHeaderActionsNode] = useState<HTMLElement | null>(null);

    const { add, edit, delete: del } = submitActions ?? {};

    const hasActionColumn =
        !!edit || !!del || (!!additionalActions && additionalActions.length > 0);

    const renderActions = (item: T) => (
        <div className="flex items-center gap-1 justify-end">
            {additionalActions?.map((action, i) =>
                action.tooltip ? (
                    <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        title={action.tooltip}
                        className={action.className ?? 'h-8 w-8'}
                        onClick={() => action.onClick(item)}
                    >
                        {action.icon}
                    </Button>
                ) : (
                    <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        className={action.className ?? 'h-8 w-8'}
                        onClick={() => action.onClick(item)}
                    >
                        {action.icon}
                    </Button>
                ),
            )}

            {edit && (
                <Button
                    variant="ghost"
                    size="icon"
                    title='edit'
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                        setSelectedItem(item);
                        if (mutationMode === 'modal') {
                            setIsEditModalOpen(true);
                        } else {
                            setView('edit');
                        }
                    }}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            )}

            {del && (
                <Button
                    title='delete'
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                        setSelectedItem(item);
                        setIsDeleteOpen(true);
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );

    // ── Action column ─────────────────────────────────────────────────────────
    const actionColumn: Column<T> = {
        title: 'Aksi',
        copyValue: false,
        key: '__actions__' as keyof T,
        className: 'justify-end text-right',
        render: (item: T) => renderActions(item),
    };

    const enrichedColumns: Column<T>[] = hasActionColumn
        ? [...columns, actionColumn]
        : columns;

    // ── Delete confirm handler ────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!del?.onConfirm || !selectedItem) return;
        setIsDeleting(true);
        setGlobalMutationState({ isPending: true, isSuccess: false, isError: false, status: 'pending' });
        try {
            await del.onConfirm(selectedItem);
            setGlobalMutationState({ isPending: false, isSuccess: true, isError: false, status: 'success' });
            setIsDeleteOpen(false);
            setSelectedItem(null);
            setTimeout(() => {
                setGlobalMutationState({ isPending: false, isSuccess: false, isError: false, status: 'idle' });
            }, 5000);
        } catch {
            setGlobalMutationState({ isPending: false, isSuccess: false, isError: true, status: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    // ── Helpers to render managed form (add/edit via mutationForm prop) ────────
    const renderManagedAddForm = (onDone: () => void) => {
        if (!mutationForm || !add?.onConfirm) return null;
        return (
            <ManagedForm<TData>
                formComponent={mutationForm.component}
                resolver={mutationForm.resolver}
                defaultValues={mutationForm.emptyValues}
                onConfirm={add.onConfirm}
                onDone={onDone}
                submitLabel="Simpan"
                cancelLabel="Batal"
                onCancel={onDone}
                mutationMode={mutationMode}
                headerActionsNode={headerActionsNode}
                setGlobalMutationState={setGlobalMutationState}
            />
        );
    };

    const renderManagedEditForm = (item: T, onDone: () => void) => {
        if (!mutationForm || !edit?.onConfirm) return null;
        return (
            <ManagedForm<TData>
                formComponent={mutationForm.component}
                resolver={mutationForm.resolver}
                defaultValues={mutationForm.defaultValues(item)}
                onConfirm={(data) => edit.onConfirm!(item, data)}
                onDone={onDone}
                submitLabel="Simpan Perubahan"
                cancelLabel="Batal"
                onCancel={onDone}
                mutationMode={mutationMode}
                headerActionsNode={headerActionsNode}
                setGlobalMutationState={setGlobalMutationState}
            />
        );
    };

    // ── Content-mode: Add view ────────────────────────────────────────────────
    if (mutationMode === 'content' && view === 'add' && add) {
        const contentTitle = add.contentTitle ?? `Tambah ${title}`;
        const contentDesc = add.contentDescription ?? `Isi form berikut untuk menambahkan data baru.`;
        return (
            <div className="p-4 h-full flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-4 mb-6 -mt-4 -mx-4 px-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setView('list')} className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{contentTitle}</h1>
                            <p className="text-muted-foreground text-sm">{contentDesc}</p>
                        </div>
                    </div>
                    <div ref={setHeaderActionsNode} className="flex items-center gap-2">
                        {(!mutationForm || !add?.onConfirm) && (
                            <Button variant="outline" onClick={() => setView('list')}>Batal</Button>
                        )}
                    </div>
                </div>
                <div className="flex-1 pb-6">
                    {add.component
                        ? add.component(() => setView('list'))
                        : renderManagedAddForm(() => setView('list'))
                    }
                </div>
            </div>
        );
    }

    // ── Content-mode: Edit view ───────────────────────────────────────────────
    if (mutationMode === 'content' && view === 'edit' && edit && selectedItem) {
        const resolvedTitle = resolve(edit.contentTitle, selectedItem) ?? `Edit ${title}`;
        const resolvedDesc = resolve(edit.contentDescription, selectedItem);
        const handleBack = () => { setView('list'); setSelectedItem(null); };
        return (
            <div className="p-4 h-full flex flex-col">
                <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-4 mb-6 -mt-4 -mx-4 px-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{resolvedTitle}</h1>
                            {resolvedDesc && <p className="text-muted-foreground text-sm">{resolvedDesc}</p>}
                        </div>
                    </div>
                    <div ref={setHeaderActionsNode} className="flex items-center gap-2">
                        {(!mutationForm || !edit?.onConfirm) && (
                            <Button variant="outline" onClick={handleBack}>Batal</Button>
                        )}
                    </div>
                </div>
                <div className="flex-1 pb-6">
                    {edit.component
                        ? edit.component(selectedItem, handleBack)
                        : renderManagedEditForm(selectedItem, handleBack)
                    }
                </div>
            </div>
        );
    }

    // ── List view (default) ───────────────────────────────────────────────────
    return (
        <div className="p-4 h-full flex flex-col gap-4">
            {/* Page header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight flex gap-2">
                        <span>{title}</span>
                        {
                            filterLabels?.map((label, idx) => (
                                <Badge variant='outline' key={idx}>
                                    {label}
                                </Badge>
                            ))
                        }
                    </h1>
                    {description && <p className="text-muted-foreground text-sm">{description}</p>}
                </div>

                {add && (
                    mutationMode === 'modal' ? (
                        <Modal
                            open={isAddModalOpen}
                            onOpenChange={setIsAddModalOpen}
                            trigger={
                                <Button className="h-10 px-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {add.label ?? `Tambah ${title}`}
                                </Button>
                            }
                            title={add.modalTitle}
                            description={add.modalDescription}
                            size={add.modalSize ?? 'md'}
                        >
                            {add.component
                                ? add.component(() => setIsAddModalOpen(false))
                                : renderManagedAddForm(() => setIsAddModalOpen(false))
                            }
                        </Modal>
                    ) : (
                        <Button className="h-10 px-4" onClick={() => setView('add')}>
                            <Plus className="mr-2 h-4 w-4" />
                            {add.label ?? `Tambah ${title}`}
                        </Button>
                    )
                )}
            </div>

            {/* Content (Table or Grid) */}
            {gridRenderItem ? (
                isLoading ? (
                    <div className="flex justify-center items-center py-20 border rounded-md bg-muted/10">
                        <div className="h-8 w-8 animate-spin border-4 border-primary/30 rounded-full border-t-primary" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex justify-center items-center py-20 border rounded-md bg-muted/10">
                        <p className="text-muted-foreground">Tidak ada data ditemukan.</p>
                    </div>
                ) : (
                    <div className={gridClassName}>
                        {data.map((item, idx) => (
                            <React.Fragment key={item.id ?? idx}>
                                {gridRenderItem(item, renderActions(item))}
                            </React.Fragment>
                        ))}
                    </div>
                )
            ) : (
                <BaseTable
                    columns={enrichedColumns}
                    data={data}
                    enableColumnToggle={enableColumnToggle}
                    isLoading={isLoading}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            )}

            {/* Pagination */}
            {totalItems > itemsPerPage && onPageChange && onItemsPerPageChange && (
                <PaginationWithShow
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    onItemsPerPageChange={onItemsPerPageChange}
                />
            )}

            {/* Edit modal (modal mode only) */}
            {edit && mutationMode === 'modal' && (
                <Modal
                    open={isEditModalOpen}
                    onOpenChange={(open) => { setIsEditModalOpen(open); if (!open) setSelectedItem(null); }}
                    title={selectedItem ? resolve(edit.modalTitle, selectedItem) : undefined}
                    description={selectedItem ? resolve(edit.modalDescription, selectedItem) : undefined}
                    size={edit.modalSize ?? 'md'}
                >
                    {selectedItem && (
                        edit.component
                            ? edit.component(selectedItem, () => { setIsEditModalOpen(false); setSelectedItem(null); })
                            : renderManagedEditForm(selectedItem, () => { setIsEditModalOpen(false); setSelectedItem(null); })
                    )}
                </Modal>
            )}

            {/* Delete: custom component or built-in AlertDialog */}
            {del && selectedItem && (
                del.component
                    ? del.component(selectedItem, isDeleteOpen, (open) => { setIsDeleteOpen(open); if (!open) setSelectedItem(null); })
                    : (
                        <AlertDialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); if (!open) setSelectedItem(null); }}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {resolve(del.title, selectedItem) ?? 'Hapus Data?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {resolve(del.description, selectedItem) ?? 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => { e.preventDefault(); handleDeleteConfirm(); }}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                    >
                                        {isDeleting ? 'Menghapus...' : (del.confirmLabel ?? 'Hapus')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )
            )}

            <MutationFeedback {...globalMutationState} />
        </div>
    );
}
