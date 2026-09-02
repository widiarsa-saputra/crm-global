import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import JobListContent from '../components/JobListContent';

const JobListPage: React.FC = () => {
    return (
        <AdminLayout>
            <JobListContent />
        </AdminLayout>
    );
};

export default JobListPage;
