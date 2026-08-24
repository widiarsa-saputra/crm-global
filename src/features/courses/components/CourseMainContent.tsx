import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useCourseIndex,
    useCourseCreate,
    useCourseUpdate,
    useCourseDelete,
    CourseEntity,
    CourseCreateSchema,
    CourseCreatePayload,
    CourseLevelEnum,
    CourseStatusEnum,
} from '@/services/courses';
import { CourseCategoryEntity, useCourseCategoryIndex } from '@/services/course-categories';
import { CourseMutationForm } from '.';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LabelComp from '@/components/LabelComp';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CourseMainContent: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const initialFilterState: {
        course_category_id: string | undefined;
        course_category_data: CourseCategoryEntity | undefined;
        level: string | undefined;
        status: string | undefined;
    } = {
        course_category_id: undefined,
        course_category_data: undefined,
        level: undefined,
        status: undefined,
    };
    const [filter, setFilter] = useState(initialFilterState);
    const [tempFilter, setTempFilter] = useState(initialFilterState);
    const [filterLabels, setFilterLabels] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [categorySearch, setCategorySearch] = useState('');
    const debouncedCategorySearch = useDebounce(categorySearch, 500);

    const { data: categoryData, isLoading: isLoadingCategory } = useCourseCategoryIndex({
        search: debouncedCategorySearch,
        include: 'parent',
        paginate: 30,
    });

    const categoryOptions = (categoryData?.data ?? []).map(cat => ({
        label: cat.name ?? '',
        value: String(cat.id),
        data: cat,
    }));

    const { data, isLoading } = useCourseIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        filter,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCourseCreate();
    const editMutation = useCourseUpdate();
    const deleteMutation = useCourseDelete();

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, filter, sortBy, sortOrder]);

    const handleClearFilter = () => {
        setFilter(initialFilterState);
        setTempFilter(initialFilterState);
    };

    const handleApplyFilter = () => {
        setFilter(tempFilter);
    };

    const filterContent = useMemo(() => (
        <div className="flex flex-col gap-4">
            <div>
                <LabelComp>Kategori</LabelComp>
                <SearchableSelect
                    options={categoryOptions}
                    value={tempFilter.course_category_id || ''}
                    onChange={(val) => {
                        const valStr = val as string;
                        let categoryData = undefined;
                        if (valStr) {
                            const selectedOpt = categoryOptions.find(opt => opt.value === valStr);
                            if (selectedOpt && selectedOpt.data) {
                                categoryData = selectedOpt.data;
                            }
                        }
                        setTempFilter(prev => ({ ...prev, course_category_id: valStr || undefined, course_category_data: categoryData }));
                    }}
                    placeholder="Semua Kategori"
                    serverSideSearch
                    searchValue={categorySearch}
                    onSearchChange={setCategorySearch}
                    isPending={isLoadingCategory}
                />
            </div>
            <div>
                <LabelComp>Level</LabelComp>
                <Select value={tempFilter.level} onValueChange={(val) => setTempFilter(prev => ({ ...prev, level: val }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Semua Level</SelectItem>
                        {CourseLevelEnum.map(lvl => (
                            <SelectItem key={lvl} value={lvl}>{lvl.replace('_', ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <LabelComp>Status</LabelComp>
                <Select value={tempFilter.status} onValueChange={(val) => setTempFilter(prev => ({ ...prev, status: val }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Semua Status</SelectItem>
                        {CourseStatusEnum.map(st => (
                            <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    ), [categoryOptions, tempFilter, categorySearch, isLoadingCategory]);

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari kursus...',
            value: search,
            onChange: setSearch,
        },
        filter: {
            content: filterContent,
            onClear: handleClearFilter,
            onApply: handleApplyFilter,
        },
    }), [search, filterContent]);

    useTopbarActions(topbarConfig);

    const columns = useMemo(() => [
        {
            title: 'Judul Kursus',
            key: 'title',
            sortable: true,
            expand: true,
            render: (item: CourseEntity) => {
                const getStatusStyle = (status?: string | null) => {
                    switch (status) {
                        case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100';
                        case 'reviewed': return 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
                        case 'published': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100';
                        default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
                    }
                };

                return (
                    <div className="flex gap-2 items-center">
                        <p className="font-semibold">
                            {item.title}
                        </p>
                        <Badge variant='outline' className={`capitalize border shadow-none ${getStatusStyle(item.status)}`}>
                            {item.status}
                        </Badge>
                    </div>
                );
            }
        },
        {
            title: 'Kategori',
            key: 'course_category_name',
            sortable: true,
            render: (item: CourseEntity) => item.course_category_name || '-',
        },
        {
            title: 'Level',
            key: 'level',
            sortable: true,
            render: (item: CourseEntity) => {
                const getLevelStyle = (level?: string | null) => {
                    switch (level) {
                        case 'beginner': return ' text-green-700 border-green-200';
                        case 'intermediate': return ' text-yellow-700 border-yellow-200';
                        case 'advanced': return ' text-red-700 border-red-200';
                        default: return ' text-slate-700 hover:';
                    }
                };
                return (
                    <Badge className={`capitalize border-0 bg-transparent font-semibold ${getLevelStyle(item.level)}`}>
                        {item.level?.replace('_', ' ') || '-'}
                    </Badge>
                );
            },
        },
        {
            title: 'Total Peserta',
            key: 'total_student',
            sortable: true,
            render: (item: CourseEntity) => item?.total_students ?? 0,
        },
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    useEffect(() => {
        const labels: string[] = [];

        if (filter.course_category_data?.name) {
            labels.push(`Category: ${filter.course_category_data.name}`);
        }

        if (filter.level && filter.level !== 'none') {
            labels.push(`Level: ${filter.level.replace('_', ' ')}`);
        }

        if (filter.status && filter.status !== 'none') {
            labels.push(`Status: ${filter.status}`);
        }

        setFilterLabels(labels);
    }, [filter]);

    return (
        <DataPageTemplate<CourseEntity, CourseCreatePayload>
            title="Daftar Kursus"
            filterLabels={filterLabels}
            description="Kelola data kursus dan materi pembelajaran."
            columns={columns}
            data={displayData}
            isLoading={isLoading}
            enableColumnToggle
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationMode="modal"
            mutationForm={{
                component: CourseMutationForm,
                resolver: zodResolver(CourseCreateSchema),
                emptyValues: {
                    title: '',
                    course_category_id: null,
                    thumbnail_file_id: null,
                    description: '',
                    level: null,
                    status: 'draft',
                    video_url: '',
                    has_certificate: false,
                    duration: null,
                },
                defaultValues: (course) => ({
                    title: course.title ?? '',
                    course_category_id: course.course_category_id ?? null,
                    thumbnail_file_id: course.thumbnail_file_id ?? null,
                    description: course.description ?? '',
                    level: course.level ?? null,
                    status: course.status ?? 'draft',
                    video_url: course.video_url ?? '',
                    has_certificate: course.has_certificate ?? false,
                    duration: course.duration ?? null,
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Kursus',
                    modalTitle: 'Tambah Kursus',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data kursus baru.',
                    modalSize: 'lg',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (course) => `Edit Kursus — ${course.title}`,
                    modalSize: 'lg',
                    onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); },
                },
                delete: {
                    onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); },
                },
            }}
            additionalActions={[
                {
                    icon: <BookOpen className="h-4 w-4" />,
                    onClick: (item) => navigate(`/courses/${item.id}/builder`),
                    tooltip: 'Build Course (Silabus)',
                    className: 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50'
                }
            ]}
        />
    );
};

export default CourseMainContent;
