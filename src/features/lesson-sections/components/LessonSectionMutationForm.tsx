import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import LabelComp from '@/components/LabelComp';
import { Switch } from '@/components/ui/switch';
import { LessonSectionCreatePayload } from '@/services/lesson-sections';
import { FloatingInput, FloatingTextArea } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { useLessonIndex } from '@/services/lessons';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
    form: UseFormReturn<LessonSectionCreatePayload>;
}

const typeOptions = [
    { label: 'Video', value: 'video' },
    { label: 'Article', value: 'article' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Quiz', value: 'quiz' },
];

const LessonSectionMutationForm: React.FC<Props> = ({ form }) => {
    const { register, control, watch, formState: { errors } } = form;

    const [lessonSearch, setLessonSearch] = useState('');
    const debouncedLessonSearch = useDebounce(lessonSearch, 500);
    const { data: lessonResp } = useLessonIndex({ search: debouncedLessonSearch, paginate: 30 });
    const lessonOptions = (lessonResp?.data ?? []).map(l => ({ label: l.title ?? String(l.id), value: String(l.id) }));

    return (
        <form className="flex flex-col gap-4 mt-2" id="lesson-sections-form">
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

            <FloatingTextArea
                id="content"
                label="Konten"
                watch={watch('content') || ''}
                error={errors.content?.message}
                inputProps={{
                    ...register('content'),
                    rows: 3
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <Combobox
                            id="type"
                            label="Tipe"
                            options={typeOptions}
                            value={field.value?.toString() || ""}
                            onChange={(val) => field.onChange(val.value || null)}
                            error={errors.type?.message as string}
                            inputProps={{ placeholder: "Pilih Tipe..." }}
                        />
                    )}
                />

                <FloatingInput
                    id="duration"
                    type="number"
                    label="Durasi (Menit)"
                    watch={watch('duration')?.toString()}
                    error={errors.duration?.message}
                    inputProps={{
                        ...register('duration'),
                        min: 0
                    }}
                />
            </div>

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

            <div className="flex items-center gap-2 mt-2">
                <Controller
                    control={control}
                    name="can_preview"
                    render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                />
                <LabelComp className="mb-0">Bisa Preview?</LabelComp>
            </div>
            {errors.can_preview && <span className="text-red-500 text-xs">{errors.can_preview.message as string}</span>}
        </form>
    );
};

export default LessonSectionMutationForm;
