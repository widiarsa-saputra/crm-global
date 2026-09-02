import React, { useState } from 'react';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Column } from '@/shared/components/table/BaseTable';
import { useIndexJobList, JobList } from '@/services/job-list';
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


    const jobLists = Array.isArray(response?.data) ? response.data : [];
    const totalItems = response?.pagination?.total || 0;

    const columns: Column<JobList>[] = [
        { title: 'ID', key: 'id' },
        { 
            title: 'Triggered By', 
            key: 'triggered_by',
            render: (item) => item.user ? item.user.name || item.user.email : item.triggered_by
        },
        { 
            title: 'Contacts', 
            key: 'total_contacts',
            render: (item) => `${item.processed_contacts} / ${item.total_contacts}`
        },
        { 
            title: 'Status', 
            key: 'status',
            render: (item) => {
                const isCompleted = item.status === 'completed';
                return (
                    <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {item.status}
                    </Badge>
                );
            }
        },
        {
            title: 'Started At',
            key: 'started_at',
            render: (item) => item.started_at ? new Date(item.started_at).toLocaleString() : '-'
        },
        {
            title: 'Completed At',
            key: 'completed_at',
            render: (item) => item.completed_at ? new Date(item.completed_at).toLocaleString() : '-'
        }
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
        />
    );
};

export default JobListContent;
