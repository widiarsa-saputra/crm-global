import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { PeriodEnrollmentCreatePayload } from '@/services/period-enrollments';
import Combobox from '@/components/Combobox';
import { usePeriodIndex } from '@/services/periods';
import { useStudentIndex } from '@/services/students';
import { useCurriculumIndex } from '@/services/curriculums';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<PeriodEnrollmentCreatePayload>;
}

const PeriodEnrollmentMutationForm: React.FC<Props> = ({ form }) => {
    const { control, formState: { errors } } = form;

    const [periodSearch, setPeriodSearch] = useState('');
    const debouncedPeriodSearch = useDebounce(periodSearch, 500);
    const { data: periodResp } = usePeriodIndex({ search: debouncedPeriodSearch, paginate: 30 });
    const periodOptions = (periodResp?.data ?? []).map(p => ({ label: p.title ?? String(p.id), value: String(p.id) }));

    const [studentSearch, setStudentSearch] = useState('');
    const debouncedStudentSearch = useDebounce(studentSearch, 500);
    const { data: studentResp } = useStudentIndex({ search: debouncedStudentSearch, paginate: 30 });
    const studentOptions = (studentResp?.data ?? []).map(s => ({ label: s.name ?? String(s.id), value: String(s.id) }));

    const [curriculumSearch, setCurriculumSearch] = useState('');
    const debouncedCurriculumSearch = useDebounce(curriculumSearch, 500);
    const { data: curriculumResp } = useCurriculumIndex({ search: debouncedCurriculumSearch, paginate: 30 });
    const curriculumOptions = (curriculumResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="period-enrollments-form">
            <Controller
                control={control}
                name="period_id"
                render={({ field }) => (
                    <Combobox
                        id="period_id"
                        label="Period"
                        options={periodOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setPeriodSearch}
                        error={errors.period_id?.message as string}
                        inputProps={{ placeholder: "Pilih Period..." }}
                    />
                )}
            />

            <Controller
                control={control}
                name="student_id"
                render={({ field }) => (
                    <Combobox
                        id="student_id"
                        label="Student"
                        options={studentOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setStudentSearch}
                        error={errors.student_id?.message as string}
                        inputProps={{ placeholder: "Pilih Student..." }}
                    />
                )}
            />

            <Controller
                control={control}
                name="curriculum_id"
                render={({ field }) => (
                    <Combobox
                        id="curriculum_id"
                        label="Curriculum"
                        options={curriculumOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setCurriculumSearch}
                        error={errors.curriculum_id?.message as string}
                        inputProps={{ placeholder: "Pilih Curriculum..." }}
                    />
                )}
            />
        </form>
    );
};

export default PeriodEnrollmentMutationForm;
