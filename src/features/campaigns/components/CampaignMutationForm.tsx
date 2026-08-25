import { useEffect, useMemo, useRef } from 'react';
import { UseFormReturn, Controller, FieldValues, Path, PathValue, SubmitHandler } from 'react-hook-form';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import Combobox, { TimezoneCombobox } from '@/components/Combobox';
import { SubmitLoading } from '@/components/SubmitLoading';
import { Type, Mail, Calendar, Users, FileText, Clock } from 'lucide-react';
import { useIndexSegment } from '@/services/segments';
import { useIndexTemplate } from '@/services/templates';
import { useIndexContact } from '@/services/contacts';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    const { control, handleSubmit, formState: { errors }, watch, setValue } = form;
    const { data: apiSegments } = useIndexSegment({});
    const { data: apiTemplates } = useIndexTemplate({});

    const watchedCampaignName = watch('campaign_name' as Path<TFieldValues>);
    const watchedEmailSubject = watch('email_subject' as Path<TFieldValues>);
    const watchedTemplateId = watch('template_id' as Path<TFieldValues>);
    const watchedSegmentId = watch('segment_id' as Path<TFieldValues>);
    const watchedDate = watch('date' as Path<TFieldValues>);
    const watchedTime = watch('time' as Path<TFieldValues>);
    const watchedTimezone = watch('timezone' as Path<TFieldValues>);
    const watchedContactIds = (watch('target_contact_ids' as Path<TFieldValues>) || []) as string[];

    const { data: apiContacts, isLoading: contactsLoading } = useIndexContact({
        params: watchedSegmentId ? { 'filter[segment_id]': watchedSegmentId, per_page: 1000 } : {}
    });

    const segmentContacts = useMemo(() => apiContacts?.data || [], [apiContacts]);

    const defaultSet = useRef(false);
    useEffect(() => {
        if (!defaultSet.current) {
            if (!watchedDate) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                setValue('date' as Path<TFieldValues>, `${year}-${month}-${day}` as PathValue<TFieldValues, Path<TFieldValues>>);
            }
            if (!watchedTime) {
                const today = new Date();
                const hours = String(today.getHours()).padStart(2, '0');
                const minutes = String(today.getMinutes()).padStart(2, '0');
                setValue('time' as Path<TFieldValues>, `${hours}:${minutes}` as PathValue<TFieldValues, Path<TFieldValues>>);
            }
            if (!watchedTimezone) {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setValue('timezone' as Path<TFieldValues>, tz as PathValue<TFieldValues, Path<TFieldValues>>);
            }
            defaultSet.current = true;
        }
    }, [watchedDate, watchedTime, watchedTimezone, setValue]);

    useEffect(() => {
        if (segmentContacts.length > 0 && watchedSegmentId) {
            if (watchedContactIds.length === 0) {
                const contactIds = segmentContacts.map(c => c.id.toString());
                setValue('target_contact_ids' as Path<TFieldValues>, contactIds as PathValue<TFieldValues, Path<TFieldValues>>);
            }
        }
    }, [segmentContacts, watchedSegmentId, setValue]); 

    const segmentOptions = useMemo(() => {
        if (!apiSegments?.data) return [];
        return apiSegments.data.map((segment) => ({
            label: segment.name,
            value: segment.id.toString(),
        }));
    }, [apiSegments]);

    const templateOptions = useMemo(() => {
        if (!apiTemplates?.data) return [];
        return apiTemplates.data.map((template: { id: string | number; name: string }) => ({
            label: template.name,
            value: template.id.toString(),
        }));
    }, [apiTemplates]);

    const selectedMessage = useMemo(() => {
        if (!watchedTemplateId || !apiTemplates?.data) return '';
        const template = (apiTemplates.data as { id: string | number; message: string }[]).find(
            (t) => String(t.id) === String(watchedTemplateId)
        );
        return template?.message || '';
    }, [watchedTemplateId, apiTemplates]);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Configuration */}
                <div className="space-y-4">
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            name={"time" as Path<TFieldValues>}
                            render={({ field }) => (
                                <FloatingInput
                                    id="time"
                                    label="Time"
                                    icon={Clock}
                                    required
                                    watch={watchedTime as string}
                                    error={errors.time?.message as string}
                                    inputProps={{
                                        ...field,
                                        type: "time",
                                        value: field.value || "",
                                    }}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={"timezone" as Path<TFieldValues>}
                            render={({ field }) => (
                                <TimezoneCombobox
                                    id="timezone"
                                    label="Timezone"
                                    required
                                    value={field.value}
                                    onChange={(val: string) => field.onChange(val)}
                                    error={errors.timezone?.message as string}
                                />
                            )}
                        />
                    </div>

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

                    {selectedMessage && (
                        <div className="p-3 bg-slate-50 text-slate-700 text-sm rounded border border-slate-200">
                            <p className="font-medium mb-1 text-[10px] text-slate-500 uppercase tracking-wider">Template Preview</p>
                            <p className="whitespace-pre-wrap">{selectedMessage}</p>
                        </div>
                    )}
                </div>

                {/* Column 2: Target Contacts */}
                <div className="flex flex-col">
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
                                onChange={(option) => {
                                    field.onChange(option.value);
                                    setValue('target_contact_ids' as Path<TFieldValues>, [] as PathValue<TFieldValues, Path<TFieldValues>>);
                                }}
                                error={errors.segment_id?.message as string}
                            />
                        )}
                    />

                    {watchedSegmentId ? (
                        <div className="flex flex-col gap-2 h-full mt-4">
                            <label className="text-sm font-medium text-slate-700">Target Contacts</label>
                            {contactsLoading ? (
                                <p className="text-sm text-slate-500">Loading contacts...</p>
                            ) : segmentContacts.length > 0 ? (
                                <div className="border border-slate-200 rounded-md overflow-hidden bg-white flex flex-col h-[500px]">
                                    <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox 
                                                id="select-all" 
                                                checked={watchedContactIds.length === segmentContacts.length && segmentContacts.length > 0}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setValue('target_contact_ids' as Path<TFieldValues>, segmentContacts.map(c => c.id.toString()) as PathValue<TFieldValues, Path<TFieldValues>>);
                                                    } else {
                                                        setValue('target_contact_ids' as Path<TFieldValues>, [] as PathValue<TFieldValues, Path<TFieldValues>>);
                                                    }
                                                }}
                                            />
                                            <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
                                                Select All ({segmentContacts.length})
                                            </label>
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1">
                                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {segmentContacts.map((contact) => (
                                                <div key={contact.id} className="flex items-start space-x-3 min-w-0">
                                                    <Checkbox 
                                                        id={`contact-${contact.id}`} 
                                                        className="mt-1"
                                                        checked={watchedContactIds.includes(contact.id.toString())}
                                                        onCheckedChange={(checked) => {
                                                            const currentIds = watchedContactIds || [];
                                                            if (checked) {
                                                                setValue('target_contact_ids' as Path<TFieldValues>, [...currentIds, contact.id.toString()] as PathValue<TFieldValues, Path<TFieldValues>>);
                                                            } else {
                                                                setValue('target_contact_ids' as Path<TFieldValues>, currentIds.filter(id => id !== contact.id.toString()) as PathValue<TFieldValues, Path<TFieldValues>>);
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`contact-${contact.id}`} className="text-sm leading-none cursor-pointer flex flex-col min-w-0">
                                                        <span className="font-medium text-slate-700">{contact.nama}</span>
                                                        <span className="text-xs text-slate-500 mt-1 truncate max-w-full" title={contact.email}>{contact.email}
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-200">No contacts found for this segment.</p>
                            )}
                            {errors.target_contact_ids && (
                                <p className="text-xs text-red-500 mt-1">{errors.target_contact_ids.message as string}</p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 mt-4">
                            <label className="text-sm font-medium text-slate-700">Target Contacts</label>
                            <div className="border border-slate-200 border-dashed rounded-md bg-slate-50 flex items-center justify-center p-8 text-slate-400 text-sm h-full min-h-[200px]">
                                Select a Target Segment to load contacts.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {mutation && <SubmitLoading mutation={mutation} />}
        </form>
    );
};
