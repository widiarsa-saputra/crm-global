import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { TutoringSessionCreatePayload, TutoringSessionStatusEnum } from '@/services/tutoring-sessions';
import { FloatingInput, FloatingDateInput, FloatingTextArea } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useEnrollmentGroupIndex } from '@/services/enrollment-groups';
import { useEnrollmentIndex } from '@/services/enrollments';
import { useTutorIndex } from '@/services/tutors';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<TutoringSessionCreatePayload>;
}

const TutoringSessionMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [egSearch, setEgSearch] = useState('');
    const debouncedEgSearch = useDebounce(egSearch, 500);
    const { data: egResp } = useEnrollmentGroupIndex({ search: debouncedEgSearch, paginate: 30 });
    const egOptions = (egResp?.data ?? []).map(c => ({ label: c.name ?? String(c.id), value: String(c.id) }));

    const [enrollmentSearch, setEnrollmentSearch] = useState('');
    const debouncedEnrollmentSearch = useDebounce(enrollmentSearch, 500);
    const { data: enrollmentResp } = useEnrollmentIndex({ search: debouncedEnrollmentSearch, paginate: 30 });
    const enrollmentOptions = (enrollmentResp?.data ?? []).map(e => ({ label: e.student?.name ?? String(e.id), value: String(e.id) }));

    const [tutorSearch, setTutorSearch] = useState('');
    const debouncedTutorSearch = useDebounce(tutorSearch, 500);
    const { data: tutorResp } = useTutorIndex({ search: debouncedTutorSearch, paginate: 30 });
    const tutorOptions = (tutorResp?.data ?? []).map(t => ({ label: t.name ?? String(t.id), value: String(t.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="tutoring-sessions-form">
            <Controller
                control={control}
                name="enrollment_group_id"
                render={({ field }) => (
                    <Combobox
                        id="enrollment_group_id"
                        label="Enrollment Group"
                        options={egOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setEgSearch}
                        error={errors.enrollment_group_id?.message as string}
                        inputProps={{ placeholder: "Pilih Enrollment Group..." }}
                    />
                )}
            />

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

            <Controller
                control={control}
                name="tutor_id"
                render={({ field }) => (
                    <Combobox
                        id="tutor_id"
                        label="Tutor"
                        options={tutorOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setTutorSearch}
                        error={errors.tutor_id?.message as string}
                        inputProps={{ placeholder: "Pilih Tutor..." }}
                    />
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="start_time"
                    render={({ field }) => (
                        <FloatingDateInput
                            id="start_time"
                            label="Start Time"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.start_time?.message as string}
                        />
                    )}
                />
                
                <Controller
                    control={control}
                    name="estimated_complete_time"
                    render={({ field }) => (
                        <FloatingDateInput
                            id="estimated_complete_time"
                            label="Est. Complete Time"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.estimated_complete_time?.message as string}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                    id="duration"
                    type="number"
                    label="Duration (Menit)"
                    watch={watch('duration')?.toString()}
                    error={errors.duration?.message}
                    inputProps={{
                        ...register('duration'),
                        min: 0
                    }}
                />

                <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <Combobox
                            id="status"
                            label="Status"
                            options={TutoringSessionStatusEnum.map(s => ({ label: s, value: s }))}
                            value={field.value?.toString() || ""}
                            onChange={(val) => field.onChange(val.value || null)}
                            error={errors.status?.message as string}
                            inputProps={{ placeholder: "Pilih Status..." }}
                        />
                    )}
                />
            </div>

            <FloatingTextArea
                id="results"
                label="Results"
                watch={watch('results') || ''}
                error={errors.results?.message}
                inputProps={{
                    ...register('results'),
                    rows: 3
                }}
            />
        </form>
    );
};

export default TutoringSessionMutationForm;
