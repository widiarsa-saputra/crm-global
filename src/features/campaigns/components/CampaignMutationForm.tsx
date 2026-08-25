import { useMemo } from 'react';
import { UseFormReturn, Controller, FieldValues, Path, SubmitHandler } from 'react-hook-form';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { SubmitLoading } from '@/components/SubmitLoading';
import { Type, Mail, Calendar, Users, FileText } from 'lucide-react';
import { useIndexSegment } from '@/services/segments';
import { useIndexTemplate } from '@/services/templates';
import { UseMutationResult } from '@tanstack/react-query';

export interface CampaignMutationFormProps<
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

export const CampaignMutationForm = <
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
}: CampaignMutationFormProps<TFieldValues, TData, TError, TVariables, TContext>) => {
    const { control, handleSubmit, formState: { errors }, watch } = form;
    const { data: apiSegments } = useIndexSegment({});
    const { data: apiTemplates } = useIndexTemplate({});

    const watchedCampaignName = watch('campaign_name' as Path<TFieldValues>);
    const watchedEmailSubject = watch('email_subject' as Path<TFieldValues>);

    const segmentOptions = useMemo(() => {
        if (!apiSegments?.data) return [];
        return apiSegments.data.map((segment) => ({
            label: segment.name,
            value: segment.id.toString(),
        }));
    }, [apiSegments]);

    const templateOptions = useMemo(() => {
        if (!apiTemplates?.data) return [];
        return apiTemplates.data.map((template: { id: string | number; message: string }) => ({
            label: template.message.length > 50 ? template.message.substring(0, 50) + '...' : template.message,
            value: template.id.toString(),
        }));
    }, [apiTemplates]);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <Controller
                control={control}
                name={"campaign_name" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="campaign_name"
                        label="Campaign Name"
                        icon={Type}
                        required
                        watch={watchedCampaignName as string}
                        error={errors.campaign_name?.message as string}
                        inputProps={{
                            ...field,
                            placeholder: "e.g., Promo Ramadhan 2026",
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name={"email_subject" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="email_subject"
                        label="Email Subject"
                        icon={Mail}
                        required
                        watch={watchedEmailSubject as string}
                        error={errors.email_subject?.message as string}
                        inputProps={{
                            ...field,
                            placeholder: "Enter subject for the email",
                        }}
                    />
                )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name={"date" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FloatingDateInput
                            id="date"
                            label="Schedule Date"
                            icon={Calendar}
                            required
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => {
                                if (date) {
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate()).padStart(2, '0');
                                    field.onChange(`${year}-${month}-${day}`);
                                } else {
                                    field.onChange("");
                                }
                            }}
                            error={errors.date?.message as string}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={"segment_id" as Path<TFieldValues>}
                    render={({ field }) => (
                        <Combobox
                            id="segment_id"
                            label="Target Segment"
                            icon={Users}
                            options={segmentOptions}
                            value={field.value ? String(field.value) : null}
                            onChange={(option) => field.onChange(option.value)}
                            error={errors.segment_id?.message as string}
                        />
                    )}
                />
            </div>
            
            <Controller
                control={control}
                name={"template_id" as Path<TFieldValues>}
                render={({ field }) => (
                    <Combobox
                        id="template_id"
                        label="Template"
                        icon={FileText}
                        options={templateOptions}
                        value={field.value ? String(field.value) : null}
                        onChange={(option) => field.onChange(option.value)}
                        error={errors.template_id?.message as string}
                    />
                )}
            />

            {mutation && <SubmitLoading mutation={mutation} />}
        </form>
    );
};
