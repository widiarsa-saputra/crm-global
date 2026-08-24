import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { AssignTryoutCreatePayload } from '@/services/assign-tryouts';
import { FloatingInput, FloatingDateInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useCourseIndex } from '@/services/courses';
import { usePeriodIndex } from '@/services/periods';
import { useTryoutIndex } from '@/services/tryouts';
import { useLessonIndex } from '@/services/lessons';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<AssignTryoutCreatePayload>;
}

const AssignTryoutMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [courseSearch, setCourseSearch] = useState('');
    const debouncedCourseSearch = useDebounce(courseSearch, 500);
    const { data: courseResp } = useCourseIndex({ search: debouncedCourseSearch, paginate: 30 });
    const courseOptions = (courseResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    const [periodSearch, setPeriodSearch] = useState('');
    const debouncedPeriodSearch = useDebounce(periodSearch, 500);
    const { data: periodResp } = usePeriodIndex({ search: debouncedPeriodSearch, paginate: 30 });
    const periodOptions = (periodResp?.data ?? []).map(p => ({ label: p.title ?? String(p.id), value: String(p.id) }));

    const [tryoutSearch, setTryoutSearch] = useState('');
    const debouncedTryoutSearch = useDebounce(tryoutSearch, 500);
    const { data: tryoutResp } = useTryoutIndex({ search: debouncedTryoutSearch, paginate: 30 });
    const tryoutOptions = (tryoutResp?.data ?? []).map(t => ({ label: t.title ?? String(t.id), value: String(t.id) }));

    const [lessonSearch, setLessonSearch] = useState('');
    const debouncedLessonSearch = useDebounce(lessonSearch, 500);
    const { data: lessonResp } = useLessonIndex({ search: debouncedLessonSearch, paginate: 30 });
    const lessonOptions = (lessonResp?.data ?? []).map(l => ({ label: l.title ?? String(l.id), value: String(l.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="assign-tryouts-form">
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
                name="tryout_id"
                render={({ field }) => (
                    <Combobox
                        id="tryout_id"
                        label="Tryout"
                        options={tryoutOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setTryoutSearch}
                        error={errors.tryout_id?.message as string}
                        inputProps={{ placeholder: "Pilih Tryout..." }}
                    />
                )}
            />

            <Controller
                control={control}
                name="lesson_id"
                render={({ field }) => (
                    <Combobox
                        id="lesson_id"
                        label="Lesson"
                        options={lessonOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setLessonSearch}
                        error={errors.lesson_id?.message as string}
                        inputProps={{ placeholder: "Pilih Lesson..." }}
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
                    name="deadline_time"
                    render={({ field }) => (
                        <FloatingDateInput
                            id="deadline_time"
                            label="Deadline"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.deadline_time?.message as string}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput
                    id="max_attempts"
                    type="number"
                    label="Max Attempts"
                    watch={watch('max_attempts')?.toString()}
                    error={errors.max_attempts?.message}
                    inputProps={{
                        ...register('max_attempts'),
                        min: 0
                    }}
                />

                <FloatingInput
                    id="order"
                    type="number"
                    label="Urutan"
                    watch={watch('order')?.toString()}
                    error={errors.order?.message}
                    inputProps={{
                        ...register('order'),
                        min: 0
                    }}
                />
            </div>
        </form>
    );
};

export default AssignTryoutMutationForm;
