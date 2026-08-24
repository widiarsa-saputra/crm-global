import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { LessonSectionFileCreatePayload } from '@/services/lesson-section-files';
import Combobox from '@/components/Combobox';
import { useLessonSectionIndex } from '@/services/lesson-sections';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { UploadSingleImage } from '@/components/UploadSingleImage';

interface Props {
    form: UseFormReturn<LessonSectionFileCreatePayload>;
}

const LessonSectionFileMutationForm: React.FC<Props> = ({ form }) => {
    const { control, formState: { errors } } = form;

    const [sectionSearch, setSectionSearch] = useState('');
    const debouncedSectionSearch = useDebounce(sectionSearch, 500);
    const { data: sectionResp } = useLessonSectionIndex({ search: debouncedSectionSearch, paginate: 30 });
    const sectionOptions = (sectionResp?.data ?? []).map(s => ({ label: s.title ?? String(s.id), value: String(s.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="lesson-section-files-form">
            <Controller
                control={control}
                name="lesson_section_id"
                render={({ field }) => (
                    <Combobox
                        id="lesson_section_id"
                        label="Lesson Section"
                        options={sectionOptions}
                        value={field.value?.toString() || ""}
                        onChange={(val) => field.onChange(val.value || null)}
                        externalSearch={setSectionSearch}
                        error={errors.lesson_section_id?.message as string}
                        inputProps={{ placeholder: "Pilih Lesson Section..." }}
                    />
                )}
            />

            <Controller
                control={control}
                name="file_id"
                render={({ field }) => (
                    <UploadSingleImage
                        value={field.value}
                        onChange={(id) => field.onChange(id)}
                        error={errors.file_id?.message as string}
                    />
                )}
            />
        </form>
    );
};

export default LessonSectionFileMutationForm;
