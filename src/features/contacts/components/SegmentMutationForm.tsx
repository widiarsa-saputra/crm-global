
import { Controller, UseFormReturn, FieldValues, Path, SubmitHandler } from 'react-hook-form';
import { FloatingInput } from '@/components/FloatingInput';
import { SubmitLoading } from '@/components/SubmitLoading';
import { Tag } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';

export interface SegmentMutationFormProps<
    TFieldValues extends FieldValues,
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown
> {
    formId: string;
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
    mutation?: UseMutationResult<TData, TError, TVariables, TContext>;
}

export const SegmentMutationForm = <
    TFieldValues extends FieldValues,
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown
>({
    formId,
    form,
    onSubmit,
    mutation
}: SegmentMutationFormProps<TFieldValues, TData, TError, TVariables, TContext>) => {
    const { control, handleSubmit, formState: { errors }, watch } = form;

    const watchedName = watch('name' as Path<TFieldValues>);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <Controller
                control={control}
                name={"name" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="name"
                        label="Segment Name"
                        icon={Tag}
                        required
                        watch={watchedName as string}
                        error={errors.name?.message as string}
                        inputProps={{
                            ...field,
                            placeholder: "Enter segment name",
                        }}
                    />
                )}
            />

            {mutation && <SubmitLoading mutation={mutation} successMessage="Segment berhasil disimpan!" errorMessage="Gagal menyimpan segment!" />}
        </form>
    );
};
