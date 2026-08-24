import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { CurriculumCourseCreatePayload } from '@/services/curriculum-courses';
import Combobox from '@/components/Combobox';
import { useCourseIndex } from '@/services/courses';
import { useCurriculumIndex } from '@/services/curriculums';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<CurriculumCourseCreatePayload>;
}

const CurriculumCourseMutationForm: React.FC<Props> = ({ form }) => {
    const { control, formState: { errors } } = form;

    const [courseSearch, setCourseSearch] = useState('');
    const debouncedCourseSearch = useDebounce(courseSearch, 500);
    const { data: courseResp } = useCourseIndex({ search: debouncedCourseSearch, paginate: 30 });
    const courseOptions = (courseResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    const [curriculumSearch, setCurriculumSearch] = useState('');
    const debouncedCurriculumSearch = useDebounce(curriculumSearch, 500);
    const { data: curriculumResp } = useCurriculumIndex({ search: debouncedCurriculumSearch, paginate: 30 });
    const curriculumOptions = (curriculumResp?.data ?? []).map(c => ({ label: c.title ?? String(c.id), value: String(c.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="curriculum-courses-form">
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
        </form>
    );
};

export default CurriculumCourseMutationForm;
