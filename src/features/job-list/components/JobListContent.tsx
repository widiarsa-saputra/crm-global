import React, { useState } from 'react';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Column } from '@/shared/components/table/BaseTable';
import { useIndexJobList, useDeleteJobList, JobList } from '@/services/job-list';
import { Badge } from '@/components/ui/badge';

const JobListContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data: response, isLoading } = useIndexJobList({
        params: {
            page: currentPage,
            paginate: itemsPerPage,
        }
    });

    const deleteMutation = useDeleteJobList();

    const jobLists = Array.isArray(response?.data) ? response.data : [];
    const totalItems = response?.pagination?.total || 0;

    const columns: Column<JobList>[] = [
        { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Description', key: 'description' },
        { 
            title: 'Status', 
            key: 'status',
            render: (item) => (
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                    {item.status}
                </Badge>
            )
        },
    ];

    return (
        <DataPageTemplate<JobList>
            title="Job List"
            description="Manage your job lists here"
            columns={columns}
            data={jobLists}
            isLoading={isLoading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            submitActions={{
                delete: {
                    onConfirm: async (item: JobList) => {
                        await deleteMutation.mutateAsync({ id: item.id });
                    },
                },
            }}
        />
    );
};

export default JobListContent;
