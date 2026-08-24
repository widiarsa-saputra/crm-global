import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { CourseSectionCreatePayload } from '@/services/course-sections';
import { FloatingInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useCourseIndex } from '@/services/courses';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<CourseSectionCreatePayload>;
}

const CourseSectionMutationForm: React.FC<Props> = ({ form }) => {
    const { control, formState: { errors } } = form;

    const [courseSearch, setCourseSearch] = useState('');
    const debouncedSearch = useDebounce(courseSearch, 500);
    const { data: courseResponse } = useCourseIndex({
        search: debouncedSearch,
        paginate: 30,
    });
    const courses = courseResponse?.data ?? [];

    const courseOptions = courses.map((course) => ({
        label: course.title ?? '',
        value: course.id.toString(),
    }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="course-sections-form">
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
                        inputProps={{ placeholder: "Pilih Course" }}
                    />
                )}
            />

            <FloatingInput
                id="title"
                label="Title"
                watch={form.watch('title')}
                error={errors.title?.message}
                inputProps={{
                    ...form.register('title')
                }}
            />

            <FloatingInput
                id="order"
                type="number"
                label="Order"
                watch={form.watch('order')?.toString()}
                error={errors.order?.message}
                inputProps={{
                    min: 0,
                    ...form.register('order')
                }}
            />
        </form>
    );
};

export default CourseSectionMutationForm;
