import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { PaymentCreatePayload } from '@/services/payments';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { UploadSingleImage } from '@/components/UploadSingleImage';
import { useEnrollmentIndex } from '@/services/enrollments';
import { useDebounce } from '@/shared/hooks/useDebounce';
import LabelComp from '@/components/LabelComp';

interface Props {
    form: UseFormReturn<PaymentCreatePayload>;
}

const PaymentMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [enrollmentSearch, setEnrollmentSearch] = useState('');
    const debouncedEnrollmentSearch = useDebounce(enrollmentSearch, 500);
    const { data: enrollmentResp } = useEnrollmentIndex({ search: debouncedEnrollmentSearch, paginate: 30 });
    const enrollmentOptions = (enrollmentResp?.data ?? []).map(e => ({ label: e.student?.name ?? String(e.id), value: String(e.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="payments-form">
            <Controller
                control={control}
                name="enrollment_id"
                render={({ field }) => (
                    <Combobox
                        id="enrollment_id"
                        label="Enrollment"
                        options={enrollmentOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setEnrollmentSearch}
                        error={errors.enrollment_id?.message as string}
                        inputProps={{ placeholder: "Pilih Enrollment..." }}
                    />
                )}
            />

            <FloatingInput
                id="nominal"
                type="number"
                label="Nominal (Rp)"
                watch={watch('nominal')?.toString()}
                error={errors.nominal?.message}
                inputProps={{
                    ...register('nominal'),
                    min: 0
                }}
            />

            <FloatingTextArea
                id="reason"
                label="Reason"
                watch={watch('reason') || ''}
                error={errors.reason?.message}
                inputProps={{
                    ...register('reason'),
                    rows: 3
                }}
            />

            <div>
                <LabelComp>Bukti Pembayaran</LabelComp>
                <Controller
                    control={control}
                    name="evidence_file_id"
                    render={({ field }) => (
                        <UploadSingleImage
                            value={field.value?.toString() || ''}
                            onChange={(val: string | undefined | null) => field.onChange(val || null)}
                        />
                    )}
                />
                {errors.evidence_file_id && <span className="text-red-500 text-xs">{errors.evidence_file_id.message as string}</span>}
            </div>
        </form>
    );
};

export default PaymentMutationForm;
