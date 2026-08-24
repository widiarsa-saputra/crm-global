import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import LabelComp from '@/components/LabelComp';
import { Switch } from '@/components/ui/switch';
import { PeriodCreatePayload } from '@/services/periods';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useCourseIndex } from '@/services/courses';
import { useCurriculumIndex } from '@/services/curriculums';
import { useTutorIndex } from '@/services/tutors';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<PeriodCreatePayload>;
}

const statusOptions = [
    { label: 'Open Registration', value: 'open_registration' },
    { label: 'On Going', value: 'on_going' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

const PeriodMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [courseSearch, setCourseSearch] = useState('');
    const debouncedCourseSearch = useDebounce(courseSearch, 500);
    const { data: courseResp } = useCourseIndex({ search: debouncedCourseSearch, paginate: 30 });
    const courseOptions = (courseResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    const [curriculumSearch, setCurriculumSearch] = useState('');
    const debouncedCurriculumSearch = useDebounce(curriculumSearch, 500);
    const { data: curriculumResp } = useCurriculumIndex({ search: debouncedCurriculumSearch, paginate: 30 });
    const curriculumOptions = (curriculumResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    const [tutorSearch, setTutorSearch] = useState('');
    const debouncedTutorSearch = useDebounce(tutorSearch, 500);
    const { data: tutorResp } = useTutorIndex({ search: debouncedTutorSearch, paginate: 30 });
    const tutorOptions = (tutorResp?.data ?? []).map(t => ({ label: t.name ?? String(t.id), value: String(t.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="periods-form">
            <FloatingInput
                id="title"
                label="Judul"
                watch={watch('title')}
                error={errors.title?.message}
                inputProps={{
                    ...register('title')
                }}
                required
            />

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
                    name="start_date"
                    render={({ field }) => (
                        <FloatingDateInput
                            id="start_date"
                            label="Start Date"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.start_date?.message as string}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="end_date"
                    render={({ field }) => (
                        <FloatingDateInput
                            id="end_date"
                            label="End Date"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.end_date?.message as string}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                    id="max_capacity"
                    type="number"
                    label="Max Capacity"
                    watch={watch('max_capacity')?.toString()}
                    error={errors.max_capacity?.message}
                    inputProps={{
                        ...register('max_capacity'),
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
                            options={statusOptions}
                            value={field.value?.toString() || ""}
                            onChange={(val) => field.onChange(val.value || null)}
                            error={errors.status?.message as string}
                            inputProps={{ placeholder: "Pilih Status..." }}
                        />
                    )}
                />
            </div>

            <div className="flex items-center gap-2 mt-2">
                <Controller
                    control={control}
                    name="has_certificate"
                    render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <LabelComp className="mb-0">Has Certificate?</LabelComp>
            </div>
            {errors.has_certificate && <span className="text-red-500 text-xs">{errors.has_certificate.message as string}</span>}
        </form>
    );
};

export default PeriodMutationForm;
