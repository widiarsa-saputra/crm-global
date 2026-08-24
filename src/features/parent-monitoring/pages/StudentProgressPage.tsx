import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { StudentProgressMainContent } from '@/features/parent-monitoring/components';

const StudentProgressPage: React.FC = () => {
    return (
        <AdminLayout>
            <StudentProgressMainContent />
        </AdminLayout>
    );
};

export default StudentProgressPage;
