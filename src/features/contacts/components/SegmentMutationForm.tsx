import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { FloatingInput } from '@/components/FloatingInput';
import { SubmitLoading } from '@/components/SubmitLoading';
import { Tag } from 'lucide-react';
import { CreateSegment, UpdateSegment } from '@/services/segments';
import { UseMutationResult } from '@tanstack/react-query';

type SegmentFormValues = CreateSegment | UpdateSegment;

export interface SegmentMutationFormProps {
    formId: string;
    form: UseFormReturn<SegmentFormValues>;
    onSubmit: (data: SegmentFormValues) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation?: UseMutationResult<any, any, any, any>;
}

export const SegmentMutationForm: React.FC<SegmentMutationFormProps> = ({ formId, form, onSubmit, mutation }) => {
    const { control, handleSubmit, formState: { errors }, watch } = form;

    const watchedName = watch('name');

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                    <FloatingInput
                        id="name"
                        label="Segment Name"
                        icon={Tag}
                        required
                        watch={watchedName}
                        error={errors.name?.message}
                        inputProps={{
                            ...field,
                            placeholder: "Enter segment name",
                        }}
                    />
                )}
            />

            {mutation && <SubmitLoading mutation={mutation} />}
        </form>
    );
};
