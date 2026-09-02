import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useCreateSegment } from '@/services/segments';
import { CreateSegmentSchema, CreateSegment } from '@/services/segments';
import { SegmentMutationForm } from './SegmentMutationForm';
import { SubmitLoading } from '@/components/SubmitLoading';

interface AddSegmentModalProps {
    trigger?: React.ReactNode;
}

export const AddSegmentModal: React.FC<AddSegmentModalProps> = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const createSegmentMutation = useCreateSegment();

    const form = useForm<CreateSegment>({
        resolver: zodResolver(CreateSegmentSchema),
        defaultValues: {
            name: '',
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            form.reset();
        }
    };

    const onSubmit = (data: CreateSegment) => {
        createSegmentMutation.mutate(data, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    };

    return (
        <>
            <Modal
                open={isOpen}
                onOpenChange={handleOpenChange}
                trigger={trigger}
                title="Add New Segment"
                description="Create a new segment to organize your contacts."
                size="sm"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={createSegmentMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" form="add-segment-form" disabled={createSegmentMutation.isPending}>
                            {createSegmentMutation.isPending ? 'Saving...' : 'Save Segment'}
                        </Button>
                    </div>
                }
            >
                <SegmentMutationForm
                    formId="add-segment-form"
                    form={form}
                    onSubmit={onSubmit}
                />
            </Modal>
            <SubmitLoading mutation={createSegmentMutation} successMessage="Segment berhasil dibuat!" errorMessage="Gagal membuat segment!" />
        </>
    );
};
