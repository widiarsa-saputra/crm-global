import { useMemo } from 'react';
import { Controller, UseFormReturn, FieldValues, Path, SubmitHandler } from 'react-hook-form';
import { FloatingInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';

import { Mail, User, Building, ShieldCheck, Users, MapPin, Phone } from 'lucide-react';
import { useIndexSegment } from '@/services/segments';

export interface ContactMutationFormProps<
    TFieldValues extends FieldValues
> {
    formId: string;
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
}

export const ContactMutationForm = <
    TFieldValues extends FieldValues
>({
    formId,
    form,
    onSubmit
}: ContactMutationFormProps<TFieldValues>) => {
    const { control, handleSubmit, formState: { errors }, watch } = form;
    const { data: apiSegments } = useIndexSegment({});

    const watchedNama = watch('nama' as Path<TFieldValues>);
    const watchedEmail = watch('email' as Path<TFieldValues>);
    const watchedCompany = watch('company' as Path<TFieldValues>);
    const watchedLocation = watch('location' as Path<TFieldValues>);
    const watchedFax = watch('fax' as Path<TFieldValues>);

    const segmentOptions = useMemo(() => {
        if (!apiSegments?.data) return [];
        return apiSegments.data.map((segment) => ({
            label: segment.name,
            value: segment.id.toString(),
        }));
    }, [apiSegments]);

    const emailStatusOptions = [
        { label: 'Valid', value: 'valid' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Invalid', value: 'invalid' },
        { label: 'Affiliated', value: 'affiliated' },
    ];

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <Controller
                control={control}
                name={"nama" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="nama"
                        label="Name"
                        icon={User}
                        required
                        watch={watchedNama as string}
                        error={errors.nama?.message as string}
                        inputProps={{
                            ...field,
                            placeholder: "Enter full name",
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name={"email" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="email"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        required
                        watch={watchedEmail as string}
                        error={errors.email?.message as string}
                        inputProps={{
                            ...field,
                            placeholder: "email@example.com",
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name={"company" as Path<TFieldValues>}
                render={({ field }) => (
                    <FloatingInput
                        id="company"
                        label="Company (Optional)"
                        icon={Building}
                        watch={watchedCompany as string}
                        error={errors.company?.message as string}
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
                    name={"location" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FloatingInput
                            id="location"
                            label="Location (Optional)"
                            icon={MapPin}
                            watch={watchedLocation as string}
                            error={errors.location?.message as string}
                            inputProps={{
                                ...field,
                                value: field.value ?? "",
                                placeholder: "Enter location",
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={"fax" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FloatingInput
                            id="fax"
                            label="Fax (Optional)"
                            icon={Phone}
                            watch={watchedFax as string}
                            error={errors.fax?.message as string}
                            inputProps={{
                                ...field,
                                value: field.value ?? "",
                                placeholder: "Enter fax number",
                            }}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name={"segment_id" as Path<TFieldValues>}
                    render={({ field }) => (
                        <Combobox
                            id="segment_id"
                            label="Segment"
                            icon={Users}
                            options={segmentOptions}
                            value={field.value ? String(field.value) : null}
                            onChange={(option) => field.onChange(option.value)}
                            error={errors.segment_id?.message as string}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name={"email_status" as Path<TFieldValues>}
                    render={({ field }) => (
                        <Combobox
                            id="email_status"
                            label="Email Status"
                            icon={ShieldCheck}
                            options={emailStatusOptions}
                            value={field.value ?? null}
                            onChange={(option) => field.onChange(option.value)}
                            error={errors.email_status?.message as string}
                        />
                    )}
                />
            </div>


        </form>
    );
};
