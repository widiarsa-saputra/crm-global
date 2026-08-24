import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import AdminLayout from '@/layouts/AdminLayout';
import { useCourseShow, useCourseUpdate, CourseCreateSchema, CourseCreatePayload } from '@/services/courses';
import CourseBuilderForm from '../components/CourseBuilderForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';


const CourseBuilderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: response, isLoading } = useCourseShow(id || '', { include: 'courseSections.lessons' });
    const course = response?.data;

    const updateMutation = useCourseUpdate();

    const form = useForm<CourseCreatePayload>({
        resolver: zodResolver(CourseCreateSchema),
        defaultValues: {
            title: '',
            course_category_id: null,
            thumbnail_file_id: null,
            description: '',
            level: 'beginner',
            status: 'draft',
            video_url: '',
            has_certificate: false,
            duration: null,
            course_sections: [],
        },
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (course) {
            form.reset({
                title: course.title ?? '',
                course_category_id: course.course_category_id ?? null,
                thumbnail_file_id: course.thumbnail_file_id ?? null,
                description: course.description ?? '',
                level: course.level ?? 'beginner',
                status: course.status ?? 'draft',
                video_url: course.video_url ?? '',
                has_certificate: course.has_certificate ?? false,
                duration: course.duration ?? null,
                course_sections: course.course_sections ?? [],
            });
        }
    }, [course, form]);

    const onSubmit = async (data: CourseCreatePayload) => {
        try {
            await updateMutation.mutateAsync({ id: id || '', data });
            toast.success("Berhasil menyimpan struktur kursus");
            // navigate(-1);
        } catch (error) {
            console.error("Gagal menyimpan", error);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-lg border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Course Builder: {course?.title || 'Memuat...'}</h1>
                        <p className="text-muted-foreground mt-1">Kelola silabus, seksi, dan materi (lesson) untuk kursus ini.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                        <Button 
                            onClick={form.handleSubmit(onSubmit)} 
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>

                <div className="pb-24">
                    <CourseBuilderForm form={form} />
                </div>
            </div>
        </AdminLayout>
    );
};

export default CourseBuilderPage;
