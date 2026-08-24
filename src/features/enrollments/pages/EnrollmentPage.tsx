import React from 'react';
import EnrollmentMainContent from '../components/EnrollmentMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const EnrollmentPage: React.FC = () => {
    return (
        <AdminLayout>
            <EnrollmentMainContent />
        </AdminLayout>
    );
};

export default EnrollmentPage;
