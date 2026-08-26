import { useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn, Controller, FieldValues, Path, PathValue, SubmitHandler } from 'react-hook-form';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import Combobox, { TimezoneCombobox } from '@/components/Combobox';
import { SubmitLoading } from '@/components/SubmitLoading';
import { Type, Mail, Calendar, Users, FileText, Clock, Link as LinkIcon } from 'lucide-react';
import { useIndexSegment } from '@/services/segments';
import { useIndexTemplate } from '@/services/templates';
import { useIndexContact } from '@/services/contacts';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UseMutationResult } from '@tanstack/react-query';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';
import DOMPurify from 'dompurify';
import { InputRichText } from '@/components/InputRichText';

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
    initialSegmentId?: string | number | null;
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
    mutation,
    initialSegmentId
}: CampaignMutationFormProps<TFieldValues, TData, TError, TVariables, TContext>) => {
    const { control, handleSubmit, formState: { errors }, watch, setValue } = form;
    const { data: apiSegments, isLoading: isSegmentsLoading } = useIndexSegment({});
    const { data: apiTemplates, isLoading: isTemplatesLoading } = useIndexTemplate({});

    const watchedCampaignName = watch('campaign_name' as Path<TFieldValues>);
    const watchedEmailSubject = watch('email_subject' as Path<TFieldValues>);
    const watchedTemplateId = watch('template_id' as Path<TFieldValues>);
    const watchedDate = watch('date' as Path<TFieldValues>);
    const watchedTime = watch('time' as Path<TFieldValues>);
    const watchedTimezone = watch('timezone' as Path<TFieldValues>);
    const watchedCampaignContacts = (watch('campaign_contacts' as Path<TFieldValues>) || []) as { contact_id: string | number }[];
    const [watchedSegmentId, setWatchedSegmentId] = useState<string | null>(initialSegmentId ? String(initialSegmentId) : null);
    const [fileError, setFileError] = useState<string | null>(null);

    const { data: apiContacts, isLoading: contactsLoading } = useIndexContact({
        params: watchedSegmentId && watchedSegmentId !== 'all'
            ? { 'filter[segment_id]': watchedSegmentId, paginate: 1000 }
            : watchedSegmentId === 'all'
                ? { paginate: 1000 }
                : {}
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
            if (watchedCampaignContacts.length === 0) {
                const contactIds = segmentContacts.map(c => c.id.toString());
                setValue('campaign_contacts' as Path<TFieldValues>, contactIds.map(id => ({ contact_id: id })) as PathValue<TFieldValues, Path<TFieldValues>>);
            }
        }
    }, [segmentContacts, watchedSegmentId, setValue]);

    const segmentOptions = useMemo(() => {
        const base = [{ label: '-- All Segments --', value: 'all' }];
        if (!apiSegments?.data) return base;
        return [
            ...base,
            ...apiSegments.data.map((segment) => ({
                label: segment.name,
                value: segment.id.toString(),
            }))
        ];
    }, [apiSegments]);

    const templateOptions = useMemo(() => {
        const base = [{ label: '-- Custom Message --', value: '' }];
        if (!apiTemplates?.data) return base;
        return [
            ...base,
            ...apiTemplates.data.map((template: { id: string | number; name: string }) => ({
                label: template.name,
                value: template.id.toString(),
            }))
        ];
    }, [apiTemplates]);

    const selectedMessage = useMemo(() => {
        if (!watchedTemplateId || !apiTemplates?.data) return '';
        const template = (apiTemplates.data as { id: string | number; message: string }[]).find(
            (t) => String(t.id) === String(watchedTemplateId)
        );
        return template?.message || '';
    }, [watchedTemplateId, apiTemplates]);

    const [isEmailSubjectFocused, setIsEmailSubjectFocused] = useState(false);

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
                            <div className="relative flex flex-col">
                                {isEmailSubjectFocused && (
                                    <div className="flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-1">
                                        {[
                                            { label: 'Name', value: 'nama' },
                                            { label: 'Email', value: 'email' },
                                            { label: 'Company', value: 'company' },
                                        ].map((v) => (
                                            <button
                                                key={v.value}
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault(); // Mencegah input kehilangan fokus
                                                    const currentValue = field.value || "";
                                                    field.onChange(currentValue + (currentValue ? " " : "") + `{{${v.value}}}`);
                                                }}
                                                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors border border-slate-200"
                                            >
                                                +{v.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <FloatingInput
                                    id="email_subject"
                                    label="Email Subject"
                                    icon={Mail}
                                    required
                                    watch={watchedEmailSubject as string}
                                    error={errors.email_subject?.message as string}
                                    inputProps={{
                                        ...field,
                                        onFocus: () => setIsEmailSubjectFocused(true),
                                        onBlur: () => setIsEmailSubjectFocused(false),
                                        placeholder: "Enter subject for the email",
                                    }}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name={"template_id" as Path<TFieldValues>}
                        render={({ field }) => (
                            <Combobox
                                id="template_id"
                                label="Template (Optional)"
                                icon={FileText}
                                options={templateOptions}
                                value={field.value ? String(field.value) : null}
                                onChange={(option) => field.onChange(option.value)}
                                error={errors.template_id?.message as string}
                                isLoading={isTemplatesLoading}
                            />
                        )}
                    />

                    {watchedTemplateId ? (
                        selectedMessage && (
                            <div className="bg-slate-50 text-slate-700 text-sm rounded border border-slate-200 overflow-hidden">
                                <div className="p-3 border-b border-slate-200 bg-slate-100">
                                    <p className="font-medium text-[10px] text-slate-500 uppercase tracking-wider">Template Preview</p>
                                </div>
                                <ReactQuill
                                    value={DOMPurify.sanitize(selectedMessage)}
                                    readOnly={true}
                                    theme="bubble"
                                />
                            </div>
                        )
                    ) : (
                        <Controller
                            control={control}
                            name={"message" as Path<TFieldValues>}
                            render={({ field }) => (
                                <InputRichText
                                    id="message"
                                    label="Custom Message"
                                    required
                                    value={field.value as string}
                                    onChange={field.onChange}
                                    error={errors.message?.message as string}
                                />
                            )}
                        />
                    )}

                    {/* File Upload Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name={"file_id" as Path<TFieldValues>}
                            render={({ field: { onChange, value, ...field } }) => (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Upload File (Optional) {value && (
                                        <span className="text-xs text-green-600 font-medium mt-1">
                                            {(value as unknown as File) instanceof File ? `File selected: ${(value as unknown as File).name}` : 'File is attached'}
                                        </span>
                                    )}</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-slate-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 15 * 1024 * 1024) {
                                                        setFileError("Ukuran file tidak boleh lebih dari 15MB");
                                                        e.target.value = '';
                                                        onChange(null);
                                                    } else {
                                                        setFileError(null);
                                                        onChange(file);
                                                    }
                                                } else {
                                                    onChange(null);
                                                }
                                            }}
                                            {...field}
                                            value={undefined}
                                        />
                                    </div>
                                    
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"file_url" as Path<TFieldValues>}
                            render={({ field }) => (
                                <div className="flex flex-col justify-end mt-1">
                                    <FloatingInput
                                        id="file_url"
                                        label="File URL (Optional)"
                                        icon={LinkIcon}
                                        watch={watch('file_url' as Path<TFieldValues>) as string}
                                        error={errors.file_url?.message as string}
                                        inputProps={{
                                            ...field,
                                            placeholder: "Enter file URL",
                                            value: field.value || "",
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    {fileError && <p className="text-red-500 text-sm mt-1 mb-2 font-medium">{fileError}</p>}
                </div>

                {/* Column 2: Target Contacts */}
                <div className="flex flex-col">
                    <Combobox
                        id="target_segment_id"
                        label="Target Segment Filter (Optional)"
                        icon={Users}
                        options={segmentOptions}
                        value={watchedSegmentId}
                        onChange={(option) => {
                            setWatchedSegmentId(option.value);
                            setValue('campaign_contacts' as Path<TFieldValues>, [] as PathValue<TFieldValues, Path<TFieldValues>>);
                        }}
                        isLoading={isSegmentsLoading}
                    />

                    {watchedSegmentId ? (
                        <div className="flex flex-col gap-2 h-full mt-4">
                            <label className="text-sm font-medium text-slate-700">Target Contacts</label>
                            {contactsLoading ? (
                                <p className="text-sm text-slate-500">Loading contacts...</p>
                            ) : segmentContacts.length > 0 ? (
                                <div className="border border-slate-200 rounded-md overflow-hidden bg-white flex flex-col">
                                    <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="select-all"
                                                checked={watchedCampaignContacts.length === segmentContacts.length && segmentContacts.length > 0}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setValue('campaign_contacts' as Path<TFieldValues>, segmentContacts.map(c => ({ contact_id: c.id.toString() })) as PathValue<TFieldValues, Path<TFieldValues>>);
                                                    } else {
                                                        setValue('campaign_contacts' as Path<TFieldValues>, [] as PathValue<TFieldValues, Path<TFieldValues>>);
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
                                                        checked={watchedCampaignContacts.some(c => c.contact_id.toString() === contact.id.toString())}
                                                        onCheckedChange={(checked) => {
                                                            const currentContacts = watchedCampaignContacts || [];
                                                            if (checked) {
                                                                setValue('campaign_contacts' as Path<TFieldValues>, [...currentContacts, { contact_id: contact.id.toString() }] as PathValue<TFieldValues, Path<TFieldValues>>);
                                                            } else {
                                                                setValue('campaign_contacts' as Path<TFieldValues>, currentContacts.filter(c => c.contact_id.toString() !== contact.id.toString()) as PathValue<TFieldValues, Path<TFieldValues>>);
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
                            {errors.campaign_contacts && (
                                <p className="text-xs text-red-500 mt-1">{errors.campaign_contacts.message as string}</p>
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
