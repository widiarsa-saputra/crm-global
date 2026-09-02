
import { Controller, UseFormReturn, FieldValues, Path, SubmitHandler } from 'react-hook-form';
import { FloatingInput } from '@/components/FloatingInput';

import { Tag } from 'lucide-react';

export interface SegmentMutationFormProps<
    TFieldValues extends FieldValues
> {
    formId: string;
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
}

export const SegmentMutationForm = <
    TFieldValues extends FieldValues
>({
    formId,
    form,
    onSubmit
}: SegmentMutationFormProps<TFieldValues>) => {
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


        </form>
    );
};
