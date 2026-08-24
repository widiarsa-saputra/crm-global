import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import LabelComp from '@/components/LabelComp';
import { CourseCreatePayload } from '@/services/courses/schema/CourseSchema';
import CourseLessonFieldItem from './CourseLessonFieldItem';

interface Props {
    form: UseFormReturn<CourseCreatePayload>;
    sectionIndex: number;
}

const CourseSectionFieldItem: React.FC<Props> = ({ form, sectionIndex }) => {
    const { register, control, formState: { errors } } = form;

    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: `course_sections.${sectionIndex}.lessons` as const
    });

    const fieldErrors = (errors.course_sections as any)?.[sectionIndex] || {};

    return (
        <div className="flex flex-col gap-6">
            <div>
                <LabelComp required>Judul Section</LabelComp>
                <Input type="text" {...register(`course_sections.${sectionIndex}.title` as const)} placeholder="Misal: Bab 1 Pendahuluan" className="bg-background" />
                {fieldErrors.title && <span className="text-red-500 text-xs">{fieldErrors.title.message as string}</span>}
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Daftar Lesson</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{fields.length} Lesson</span>
                </div>

                <div className="flex flex-col gap-4">
                    {fields.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                            Belum ada lesson di section ini.
                        </div>
                    )}
                    {fields.map((field, lessonIndex) => (
                        <CourseLessonFieldItem 
                            key={field.id}
                            form={form}
                            sectionIndex={sectionIndex}
                            lessonIndex={lessonIndex}
                            isFirst={lessonIndex === 0}
                            onRemove={() => remove(lessonIndex)}
                            onMoveUp={() => swap(lessonIndex, lessonIndex - 1)}
                        />
                    ))}
                </div>

                <Button 
                    type="button" 
                    variant="outline"
                    className="mt-4 w-full border-dashed"
                    onClick={() => append({ title: '', type: 'video' })}
                >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Lesson
                </Button>
            </div>
        </div>
    );
};

export default CourseSectionFieldItem;
