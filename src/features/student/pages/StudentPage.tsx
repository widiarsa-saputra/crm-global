import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { StudentMainContent } from '../components';

const StudentPage: React.FC = () => {
    return (
        <AdminLayout>
            <StudentMainContent />
        </AdminLayout>
    );
};

export default StudentPage;
