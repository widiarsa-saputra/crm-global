import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useEnrollmentGroupIndex,
    useEnrollmentGroupCreate,
    useEnrollmentGroupUpdate,
    useEnrollmentGroupDelete,
    EnrollmentGroupEntity,
    EnrollmentGroupCreateSchema,
    EnrollmentGroupCreatePayload,
} from '@/services/enrollment-groups';
import EnrollmentGroupMutationForm from './EnrollmentGroupMutationForm';

const EnrollmentGroupMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = useEnrollmentGroupIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useEnrollmentGroupCreate();
    const editMutation = useEnrollmentGroupUpdate();
    const deleteMutation = useEnrollmentGroupDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Nama', key: 'name', sortable: true, render: (item: EnrollmentGroupEntity) => item.name ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: EnrollmentGroupEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<EnrollmentGroupEntity, EnrollmentGroupCreatePayload>
            title="Enrollment Groups"
            description="Manajemen Enrollment Groups"
            columns={columns}
            data={displayItems}
            isLoading={isLoading}
            enableColumnToggle
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={(newSortBy, newSortOrder) => { setSortBy(newSortBy); setSortOrder(newSortOrder); }}
            mutationMode="modal"
            mutationForm={{
                component: EnrollmentGroupMutationForm,
                resolver: zodResolver(EnrollmentGroupCreateSchema),
                emptyValues: {
                    tutor_id: '',
                    name: '',
                    can_request_tutoring: false,
                } as any,
                defaultValues: (item) => ({
                    tutor_id: item.tutor_id ?? '',
                    name: item.name ?? '',
                    can_request_tutoring: !!item.can_request_tutoring,
                }) as any,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default EnrollmentGroupMainContent;
