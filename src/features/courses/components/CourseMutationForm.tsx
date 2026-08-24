import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import LabelComp from '@/components/LabelComp';
import { CourseCreatePayload, CourseLevelEnum, CourseStatusEnum } from '@/services/courses/schema/CourseSchema';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useCourseCategoryIndex } from '@/services/course-categories';
import { Switch } from '@/components/ui/switch';
import { FloatingInput, FloatingTextArea, FloatingCurrencyInput } from '@/components/FloatingInput';
import Combobox from '@/components/Combobox';
import { UploadSingleImage } from '@/components/UploadSingleImage';

interface Props {
    form: UseFormReturn<CourseCreatePayload>;
    initialThumbnailUrl?: string;
}

const CourseMutationForm: React.FC<Props> = ({ form, initialThumbnailUrl }) => {
    const { control, formState: { errors } } = form;

    const [categorySearch, setCategorySearch] = useState('');
    const debouncedSearch = useDebounce(categorySearch, 500);
    const { data: categoryResponse } = useCourseCategoryIndex({
        search: debouncedSearch,
        paginate: 30,
    });
    const categories = categoryResponse?.data ?? [];

    const categoryOptions = categories.map((cat) => ({
        label: cat.name ?? '',
        value: cat.id.toString(),
    }));

    return (
        <form className="space-y-4" id="courses-form">
            {/* Section 1: Thumbnail & Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 col-span-full">
                    Thumbnail
                </label>
                <article className="flex flex-col h-full">
                    <Controller
                        control={control}
                        name="thumbnail_file_id"
                        render={({ field }) => (
                            <UploadSingleImage
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                previewUrl={initialThumbnailUrl}
                                error={errors.thumbnail_file_id?.message}
                            />
                        )}
                    />
                </article>

                <article className="flex flex-col gap-4">
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
                        name="course_category_id"
                        render={({ field }) => (
                            <Combobox
                                id="course_category_id"
                                label="Kategori"
                                options={categoryOptions}
                                value={field.value?.toString() || ""}
                                onChange={(val) => field.onChange(val.value || null)}
                                externalSearch={setCategorySearch}
                                error={errors.course_category_id?.message as string}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="level"
                        render={({ field }) => (
                            <Combobox
                                id="level"
                                label="Level"
                                required
                                options={CourseLevelEnum.map((lvl) => ({
                                    label: (lvl[0].toUpperCase() + lvl.slice(1)).replace('_', ' '),
                                    value: lvl
                                }))}
                                value={field.value}
                                onChange={(val) => field.onChange(val.value)}
                                inputProps={{ placeholder: "Pilih Level" }}
                                error={errors.level?.message as string}
                            />
                        )}
                    />

                    <FloatingInput
                        id="duration"
                        type="number"
                        label="Durasi (Menit)"
                        watch={form.watch('duration')?.toString()}
                        error={errors.duration?.message}
                        inputProps={{
                            ...form.register('duration')
                        }}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <FloatingCurrencyInput
                                id="price"
                                label="Harga"
                                value={field.value ?? null}
                                onChange={field.onChange}
                                watch={field.value?.toString()}
                                error={errors.price?.message}
                            />
                        )}
                    />
                </article>
            </section>

            {/* Section 2: Status & Settings */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <article>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Combobox
                                id="status"
                                label="Status"
                                required
                                options={CourseStatusEnum.map((st) => ({
                                    label: (st[0].toUpperCase() + st.slice(1)).replace('_', ' '),
                                    value: st
                                }))}
                                value={field.value}
                                onChange={(val) => field.onChange(val.value)}
                                inputProps={{ placeholder: "Pilih Status" }}
                                error={errors.status?.message as string}
                            />
                        )}
                    />
                </article>

                <article className="flex items-center gap-3">
                    <Controller
                        control={control}
                        name="has_certificate"
                        render={({ field }) => (
                            <Switch
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <LabelComp className="!mb-0 !mt-0">Course memiliki sertifikat <span className='italic opacity-60'>(generate otomatis)</span></LabelComp>
                    {errors.has_certificate && <span className="text-red-500 text-xs">{errors.has_certificate.message as string}</span>}
                </article>
            </section>

            {/* Section 3: Description */}
            <section>
                <FloatingTextArea
                    id="description"
                    label="Deskripsi Lengkap"
                    watch={form.watch('description')?.toString()}
                    error={errors.description?.message}
                    inputProps={{
                        ...form.register('description'),
                        rows: 5
                    }}
                />
            </section>

            {/* Section 4: Video URL */}
            <section>
                <FloatingInput
                    id="video_url"
                    label="Video URL"
                    watch={form.watch('video_url') || ''}
                    error={errors.video_url?.message}
                    inputProps={{
                        ...form.register('video_url')
                    }}
                />
            </section>
        </form>
    );
};

export default CourseMutationForm;
