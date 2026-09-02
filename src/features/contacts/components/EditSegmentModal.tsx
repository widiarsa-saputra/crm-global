import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useUpdateSegment } from '@/services/segments';
import { UpdateSegmentSchema, UpdateSegment } from '@/services/segments';
import { SingleSegmentResponse } from '@/services/segments';
import { SegmentMutationForm } from './SegmentMutationForm';
import { SubmitLoading } from '@/components/SubmitLoading';

interface EditSegmentModalProps {
    segment?: SingleSegmentResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export const EditSegmentModal: React.FC<EditSegmentModalProps> = ({ segment, isOpen, onClose }) => {
    const updateSegmentMutation = useUpdateSegment();

    const form = useForm<UpdateSegment>({
        resolver: zodResolver(UpdateSegmentSchema),
        defaultValues: {
            name: segment?.name || '',
        },
    });

    useEffect(() => {
        if (isOpen && segment) {
            form.reset({
                name: segment.name,
            });
        }
    }, [isOpen, segment, form]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const onSubmit = (data: UpdateSegment) => {
        updateSegmentMutation.mutate({ id: segment?.id?.toString() ?? '', data }, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <>
            <Modal
                open={isOpen}
                onOpenChange={handleOpenChange}
                title="Edit Segment"
                description="Update the segment name."
                size="sm"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={updateSegmentMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" form="edit-segment-form" disabled={updateSegmentMutation.isPending}>
                            {updateSegmentMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <SegmentMutationForm
                    formId="edit-segment-form"
                    form={form}
                    onSubmit={onSubmit}
                />
            </Modal>
            <SubmitLoading mutation={updateSegmentMutation} successMessage="Segment berhasil disimpan!" errorMessage="Gagal menyimpan segment!" />
        </>
    );
};
