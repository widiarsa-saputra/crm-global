import React, { useMemo } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { FloatingInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { Mail, User, Building, ShieldCheck, Users } from 'lucide-react';
import { useIndexSegment } from '@/services/segments';
import { CreateContact, UpdateContact } from '@/services/contacts';

type ContactFormValues = CreateContact | UpdateContact;

export interface ContactMutationFormProps {
    formId: string;
    form: UseFormReturn<ContactFormValues>;
    onSubmit: (data: ContactFormValues) => void;
}

const emailStatusOptions = [
    { label: 'Valid', value: 'valid' },
    { label: 'Invalid', value: 'invalid' },
    { label: 'Bounced', value: 'bounced' },
    { label: 'Unsubscribed', value: 'unsubscribed' },
];

export const ContactMutationForm: React.FC<ContactMutationFormProps> = ({ formId, form, onSubmit }) => {
    const { control, handleSubmit, formState: { errors }, watch } = form;
    const { data: apiSegments } = useIndexSegment({});

    const watchedNama = watch('nama');
    const watchedEmail = watch('email');
    const watchedCompany = watch('company');

    const segmentOptions = useMemo(() => {
        if (!apiSegments?.data) return [];
        return apiSegments.data.map((segment) => ({
            label: segment.name,
            value: segment.id.toString(),
        }));
    }, [apiSegments]);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <Controller
                control={control}
                name="nama"
                render={({ field }) => (
                    <FloatingInput
                        id="nama"
                        label="Name"
                        icon={User}
                        required
                        watch={watchedNama}
                        error={errors.nama?.message}
                        inputProps={{
                            ...field,
                            placeholder: "Enter full name",
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field }) => (
                    <FloatingInput
                        id="email"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        required
                        watch={watchedEmail}
                        error={errors.email?.message}
                        inputProps={{
                            ...field,
                            placeholder: "email@example.com",
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="company"
                render={({ field }) => (
                    <FloatingInput
                        id="company"
                        label="Company (Optional)"
                        icon={Building}
                        watch={watchedCompany}
                        error={errors.company?.message}
                        inputProps={{
                            ...field,
                            value: field.value ?? "",
                            placeholder: "Company name",
                        }}
                    />
                )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="segment_id"
                    render={({ field }) => (
                        <Combobox
                            id="segment_id"
                            label="Segment"
                            icon={Users}
                            options={segmentOptions}
                            value={field.value ? String(field.value) : null}
                            onChange={(option) => field.onChange(option.value)}
                            error={errors.segment_id?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email_status"
                    render={({ field }) => (
                        <Combobox
                            id="email_status"
                            label="Email Status"
                            icon={ShieldCheck}
                            options={emailStatusOptions}
                            value={field.value ?? null}
                            onChange={(option) => field.onChange(option.value)}
                            error={errors.email_status?.message}
                        />
                    )}
                />
            </div>
        </form>
    );
};
