import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    usePaymentIndex,
    usePaymentCreate,
    usePaymentUpdate,
    usePaymentDelete,
    PaymentEntity,
    PaymentCreateSchema,
    PaymentCreatePayload,
} from '@/services/payments';
import PaymentMutationForm from './PaymentMutationForm';

const PaymentMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useTopbarActions(useMemo(() => ({ search: { value: search, onChange: setSearch, placeholder: 'Cari...' } }), [search]));

    const { data: response, isLoading } = usePaymentIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        include: 'enrollment',
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = usePaymentCreate();
    const editMutation = usePaymentUpdate();
    const deleteMutation = usePaymentDelete();

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);
    const totalItems = response?.pagination?.total ?? response?.data?.length ?? 0;

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const columns = useMemo(() => [
        { title: 'Student', key: 'student', sortable: true, render: (item: PaymentEntity) => item.enrollment_student_name ?? item.enrollment?.student?.name ?? '-' },
        { title: 'Nominal', key: 'nominal', sortable: true, render: (item: PaymentEntity) => item.nominal ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.nominal) : '-' },
        { title: 'Reason', key: 'reason', sortable: true, render: (item: PaymentEntity) => item.reason ?? '-' },
        { title: 'Dibuat Pada', key: 'created_at', sortable: true, render: (item: PaymentEntity) => item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-' },
        { title: 'Diperbarui Pada', key: 'updated_at', sortable: true, render: (item: PaymentEntity) => item.updated_at ? new Date(item.updated_at).toLocaleString('id-ID') : '-' },
    ], []);

    return (
        <DataPageTemplate<PaymentEntity, PaymentCreatePayload>
            title="Payments"
            description="Manajemen Payments"
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
                component: PaymentMutationForm,
                resolver: zodResolver(PaymentCreateSchema),
                emptyValues: {
                    enrollment_id: '',
                    nominal: 0,
                    reason: '',
                    evidence_file_id: '',
                } as PaymentCreatePayload,
                defaultValues: (item) => ({
                    enrollment_id: item.enrollment_id ?? '',
                    nominal: item.nominal ?? 0,
                    reason: item.reason ?? '',
                    evidence_file_id: item.evidence_file_id ?? '',
                }) as PaymentCreatePayload,
            }}
            submitActions={{
                add: { label: 'Tambah', modalTitle: 'Tambah', onConfirm: async (data) => { await addMutation.mutateAsync(data); } },
                edit: { modalTitle: () => 'Edit', onConfirm: async (item, data) => { await editMutation.mutateAsync({ id: item.id ?? '', data }); } },
                delete: { onConfirm: async (item) => { await deleteMutation.mutateAsync({ id: item.id ?? '' }); } },
            }}
        />
    );
};

export default PaymentMainContent;
