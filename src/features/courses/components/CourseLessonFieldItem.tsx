import React from 'react';
import { UseFormReturn, Controller, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ArrowUp } from 'lucide-react';
import LabelComp from '@/components/LabelComp';
import { CourseCreatePayload } from '@/services/courses/schema/CourseSchema';


interface Props {
    form: UseFormReturn<CourseCreatePayload>;
    sectionIndex: number;
    lessonIndex: number;
    onRemove: () => void;
    onMoveUp: () => void;
    isFirst: boolean;
}

const CourseLessonFieldItem: React.FC<Props> = ({ form, sectionIndex, lessonIndex, onRemove, onMoveUp, isFirst }) => {
    const { register, control, formState: { errors } } = form;

    const fieldErrors = (errors.course_sections as any)?.[sectionIndex]?.lessons?.[lessonIndex] || {};

    const lessonType = useWatch({
        control,
        name: `course_sections.${sectionIndex}.lessons.${lessonIndex}.type` as const
    });

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-md bg-card shadow-sm relative">
            <div className="absolute top-4 right-4 flex gap-2">
                {!isFirst && (
                    <Button type="button" variant="outline" size="icon" onClick={onMoveUp} title="Pindah ke atas">
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                )}
                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={onRemove} title="Hapus Lesson">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-2 pr-20">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                    {lessonIndex + 1}
                </span>
                <h4 className="font-semibold text-sm">Detail Lesson</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                    <LabelComp required>Judul Lesson</LabelComp>
                    <Input type="text" {...register(`course_sections.${sectionIndex}.lessons.${lessonIndex}.title` as const)} placeholder="Misal: Pengenalan Materi" />
                    {fieldErrors.title && <span className="text-red-500 text-xs">{fieldErrors.title.message as string}</span>}
                </div>

                {/* Type */}
                <div>
                    <LabelComp required>Tipe Lesson</LabelComp>
                    <Controller
                        control={control}
                        name={`course_sections.${sectionIndex}.lessons.${lessonIndex}.type` as const}
                        render={({ field }) => (
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tipe..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {['video', 'document', 'quiz'].map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {fieldErrors.type && <span className="text-red-500 text-xs">{fieldErrors.type.message as string}</span>}
                </div>
            </div>

            {/* Content / Attachment based on Type */}
            {(lessonType === 'video' || lessonType === 'pdf') && (
                <div>
                    <LabelComp>URL Lampiran / Video</LabelComp>
                    <Input type="text" {...register(`course_sections.${sectionIndex}.lessons.${lessonIndex}.attachment_url` as const)} placeholder="https://..." />
                    {fieldErrors.attachment_url && <span className="text-red-500 text-xs">{fieldErrors.attachment_url.message as string}</span>}
                </div>
            )}

            {(lessonType === 'article') && (
                <div>
                    <LabelComp>Konten Artikel</LabelComp>
                    <Textarea 
                        {...register(`course_sections.${sectionIndex}.lessons.${lessonIndex}.content_json` as const)} 
                        placeholder="Masukkan teks artikel..." 
                        rows={4} 
                    />
                    {fieldErrors.content_json && <span className="text-red-500 text-xs">{fieldErrors.content_json.message as string}</span>}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Duration */}
                <div>
                    <LabelComp>Durasi (detik)</LabelComp>
                    <Input type="number" {...register(`course_sections.${sectionIndex}.lessons.${lessonIndex}.duration_seconds` as const)} placeholder="Misal: 300" />
                    {fieldErrors.duration_seconds && <span className="text-red-500 text-xs">{fieldErrors.duration_seconds.message as string}</span>}
                </div>

                {/* Is Preview */}
                <div className="flex items-center gap-2 mt-6">
                    <Controller
                        control={control}
                        name={`course_sections.${sectionIndex}.lessons.${lessonIndex}.is_preview` as const}
                        render={({ field }) => (
                            <Checkbox 
                                id={`preview-${sectionIndex}-${lessonIndex}`} 
                                checked={field.value ?? false} 
                                onCheckedChange={field.onChange} 
                            />
                        )}
                    />
                    <label htmlFor={`preview-${sectionIndex}-${lessonIndex}`} className="text-sm font-medium">Bisa di-preview gratis?</label>
                </div>
            </div>
        </div>
    );
};

export default CourseLessonFieldItem;
