import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { EnrollmentCreatePayload, EnrollmentTypeEnum } from '@/services/enrollments';
import { FloatingInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useCourseIndex } from '@/services/courses';
import { useStudentIndex } from '@/services/students';
import { usePeriodEnrollmentIndex } from '@/services/period-enrollments';
import { useEnrollmentGroupIndex } from '@/services/enrollment-groups';
import { useCurriculumIndex } from '@/services/curriculums';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<EnrollmentCreatePayload>;
}

const EnrollmentMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [courseSearch, setCourseSearch] = useState('');
    const debouncedCourseSearch = useDebounce(courseSearch, 500);
    const { data: courseResp } = useCourseIndex({ search: debouncedCourseSearch, paginate: 30 });
    const courseOptions = (courseResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    const [studentSearch, setStudentSearch] = useState('');
    const debouncedStudentSearch = useDebounce(studentSearch, 500);
    const { data: studentResp } = useStudentIndex({ search: debouncedStudentSearch, paginate: 30 });
    const studentOptions = (studentResp?.data ?? []).map(c => ({ label: c.name ?? String(c.id), value: String(c.id) }));

    const [peSearch, setPeSearch] = useState('');
    const debouncedPeSearch = useDebounce(peSearch, 500);
    const { data: peResp } = usePeriodEnrollmentIndex({ search: debouncedPeSearch, paginate: 30 });
    const peOptions = (peResp?.data ?? []).map(c => ({ label: String(c.id), value: String(c.id) }));

    const [egSearch, setEgSearch] = useState('');
    const debouncedEgSearch = useDebounce(egSearch, 500);
    const { data: egResp } = useEnrollmentGroupIndex({ search: debouncedEgSearch, paginate: 30 });
    const egOptions = (egResp?.data ?? []).map(c => ({ label: c.name ?? String(c.id), value: String(c.id) }));

    const [curriculumSearch, setCurriculumSearch] = useState('');
    const debouncedCurriculumSearch = useDebounce(curriculumSearch, 500);
    const { data: curriculumResp } = useCurriculumIndex({ search: debouncedCurriculumSearch, paginate: 30 });
    const curriculumOptions = (curriculumResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="enrollments-form">
            <Controller
                control={control}
                name="course_id"
                render={({ field }) => (
                    <Combobox
                        id="course_id"
                        label="Course"
                        options={courseOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setCourseSearch}
                        error={errors.course_id?.message as string}
                        inputProps={{ placeholder: "Pilih Course..." }}
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
                name="period_enrollment_id"
                render={({ field }) => (
                    <Combobox
                        id="period_enrollment_id"
                        label="Period Enrollment"
                        options={peOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setPeSearch}
                        error={errors.period_enrollment_id?.message as string}
                        inputProps={{ placeholder: "Pilih Period Enrollment..." }}
                    />
                )}
            />

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

            <Controller
                control={control}
                name="type"
                render={({ field }) => (
                    <Combobox
                        id="type"
                        label="Type"
                        options={EnrollmentTypeEnum.map(t => ({ label: t, value: t }))}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        error={errors.type?.message as string}
                        inputProps={{ placeholder: "Pilih Type..." }}
                    />
                )}
            />

            <FloatingInput
                id="status"
                label="Status"
                watch={watch('status') || ''}
                error={errors.status?.message}
                inputProps={{
                    ...register('status')
                }}
            />

            <FloatingInput
                id="reason"
                label="Reason"
                watch={watch('reason') || ''}
                error={errors.reason?.message}
                inputProps={{
                    ...register('reason')
                }}
            />

            <FloatingInput
                id="total_sessions"
                type="number"
                label="Total Sessions"
                watch={watch('total_sessions')?.toString()}
                error={errors.total_sessions?.message}
                inputProps={{
                    ...register('total_sessions'),
                    min: 0
                }}
            />
        </form>
    );
};

export default EnrollmentMutationForm;
