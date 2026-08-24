import React, { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ChevronRight } from 'lucide-react';
import CourseSectionFieldItem from './CourseSectionFieldItem';

interface Props {
    form: any;
}

const CourseBuilderForm: React.FC<Props> = ({ form }) => {
    const { control } = form;

    // For Nested Sections
    const { fields: sectionFields, append: appendSection, swap: swapSection } = useFieldArray({
        control,
        name: 'course_sections',
    });

    const [activeSection, setActiveSection] = useState<number>(0);

    const watchedSections = useWatch({
        control,
        name: 'course_sections',
    });

    const title = useWatch({ control, name: 'title' });
    const level = useWatch({ control, name: 'level' });
    const status = useWatch({ control, name: 'status' });
    const price = useWatch({ control, name: 'price' });

    return (
        <form className="flex flex-col gap-8" id="courses-form">
            {/* ── GENERAL INFO ── */}
            <div className="flex flex-col gap-4 p-6 border rounded-md bg-muted/30">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Informasi Kursus</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">Read Only</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-muted-foreground mb-1">Judul Kursus</p>
                        <p className="font-semibold">{title || '-'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Level</p>
                        <p className="font-semibold capitalize">{level?.replace('_', ' ') || '-'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Status</p>
                        <p className="font-semibold capitalize">{status || '-'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Harga</p>
                        <p className="font-semibold">{price ? `Rp ${price.toLocaleString('id-ID')}` : 'Gratis'}</p>
                    </div>
                </div>
            </div>

            {/* ── SECTIONS & LESSONS ── */}
            <div className="flex flex-col md:flex-row gap-6 border rounded-md p-6 bg-card">
                
                {/* Sidebar */}
                <div className="w-full md:w-1/3 flex flex-col gap-3 border-r md:pr-6">
                    <h3 className="font-bold text-lg mb-2">Sections & Lessons</h3>
                    
                    {sectionFields.length === 0 && (
                        <div className="text-sm text-muted-foreground italic mb-2">
                            Belum ada section.
                        </div>
                    )}

                    {sectionFields.map((field, index) => {
                        const sectionTitle = watchedSections?.[index]?.title || `Section ${index + 1}`;
                        return (
                        <div key={field.id} className="flex gap-2">
                            <Button 
                                type="button" 
                                variant={activeSection === index ? 'default' : 'outline'}
                                className="flex-1 justify-between text-left h-auto py-3 border"
                                onClick={() => setActiveSection(index)}
                            >
                                <span className="truncate">{sectionTitle}</span>
                                <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            
                            {/* Move Up Button */}
                            {index > 0 && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon" 
                                    className="shrink-0"
                                    onClick={() => {
                                        swapSection(index, index - 1);
                                        if (activeSection === index) setActiveSection(index - 1);
                                        else if (activeSection === index - 1) setActiveSection(index);
                                    }}
                                    title="Move Up"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )})}

                    <Button 
                        type="button" 
                        variant="secondary"
                        className="mt-4 border-dashed"
                        onClick={() => {
                            appendSection({ title: '', lessons: [] });
                            setActiveSection(sectionFields.length);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Section
                    </Button>
                </div>

                {/* Main Content for Active Section */}
                <div className="w-full md:w-2/3">
                    {sectionFields.length > 0 && activeSection < sectionFields.length ? (
                        <CourseSectionFieldItem 
                            key={sectionFields[activeSection].id}
                            form={form} 
                            sectionIndex={activeSection} 
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground border border-dashed rounded-md p-12">
                            Pilih atau tambah section di panel kiri.
                        </div>
                    )}
                </div>

            </div>
        </form>
    );
};

export default CourseBuilderForm;
