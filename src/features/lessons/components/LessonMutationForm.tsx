import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { LessonCreatePayload } from '@/services/lessons';
import { FloatingInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useCourseSectionIndex } from '@/services/course-sections';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<LessonCreatePayload>;
}

const LessonMutationForm: React.FC<Props> = ({ form }) => {
    const { control, formState: { errors } } = form;

    const [sectionSearch, setSectionSearch] = useState('');
    const debouncedSearch = useDebounce(sectionSearch, 500);
    const { data: sectionResponse } = useCourseSectionIndex({
        search: debouncedSearch,
        paginate: 30,
    });
    const sections = sectionResponse?.data ?? [];

    const sectionOptions = sections.map((section) => ({
        label: section.title ?? '',
        value: section.id.toString(),
    }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="lessons-form">
            <FloatingInput
                id="title"
                label="Title"
                watch={form.watch('title')}
                error={errors.title?.message}
                inputProps={{
                    ...form.register('title')
                }}
                required
            />
            <Controller
                control={control}
                name="course_section_id"
                render={({ field }) => (
                    <Combobox
                        id="course_section_id"
                        label="Course Section"
                        options={sectionOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setSectionSearch}
                        error={errors.course_section_id?.message as string}
                        inputProps={{ placeholder: "Pilih Course Section" }}
                    />
                )}
            />

            <FloatingInput
                id="order"
                type="number"
                label="Order"
                watch={form.watch('order')?.toString()}
                error={errors.order?.message}
                inputProps={{
                    ...form.register('order'),
                    min: 0
                }}
            />

            <FloatingInput
                id="duration"
                type="number"
                label="Duration (Menit)"
                watch={form.watch('duration')?.toString()}
                error={errors.duration?.message}
                inputProps={{
                    ...form.register('duration'),
                    min: 0
                }}
            />
        </form>
    );
};

export default LessonMutationForm;
