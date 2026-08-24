import React from 'react';
import CurriculumMainContent from '../components/CurriculumMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const CurriculumPage: React.FC = () => {
    return (
        <AdminLayout>
            <CurriculumMainContent />
        </AdminLayout>
    );
};

export default CurriculumPage;
