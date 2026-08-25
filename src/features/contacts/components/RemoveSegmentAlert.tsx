import React from 'react';
import { createPortal } from 'react-dom';
import AlertDialog from '@/shared/components/alert-dialog/AlertDialog';
import { useDeleteSegment } from '@/services/segments';
import { SingleSegmentResponse } from '@/services/segments';
import { SubmitLoading } from '@/components/SubmitLoading';
import { useQueryClient, UseMutationResult } from '@tanstack/react-query';

interface RemoveSegmentAlertProps {
    segment: SingleSegmentResponse;
    isOpen: boolean;
    onClose: () => void;
}

export const RemoveSegmentAlert: React.FC<RemoveSegmentAlertProps> = ({ segment, isOpen, onClose }) => {
    const deleteSegmentMutation = useDeleteSegment();
    const queryClient = useQueryClient();

    const [isAlertOpen, setIsAlertOpen] = React.useState(isOpen);

    React.useEffect(() => {
        setIsAlertOpen(isOpen);
    }, [isOpen]);

    const handleConfirm = () => {
        if (!segment) return;
        deleteSegmentMutation.mutate({ id: segment.id.toString() }, {
            onSuccess: () => {
                setIsAlertOpen(false);
                queryClient.invalidateQueries({ queryKey: ['contact-list'] });
                queryClient.invalidateQueries({ queryKey: ['contact-list-infinite'] });
                setTimeout(() => {
                    onClose();
                }, 2000);
            },
        });
    };

    return (
        <>
            {typeof window !== 'undefined' && document.body
                ? createPortal(
                    <div className="relative z-[100]">
                        <SubmitLoading
                            mutation={deleteSegmentMutation as UseMutationResult}
                            successMessage="Segment berhasil dihapus"
                            errorMessage="Gagal menghapus segment"
                        />
                    </div>,
                    document.body
                )
                : null}
            <AlertDialog
                open={isAlertOpen}
                onOpenChange={(open) => {
                    setIsAlertOpen(open);
                    if (!open) onClose();
                }}
                title="Delete Segment"
                description={`Are you sure you want to delete "${segment?.name ?? 'this segment'}"? All contacts in this segment will become unassigned.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleConfirm}
                onCancel={onClose}
                isLoading={deleteSegmentMutation.isPending}
            />
        </>
    );
};
