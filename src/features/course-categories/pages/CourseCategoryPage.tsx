import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { CourseCategoryMainContent } from '../components';

const CourseCategoryPage: React.FC = () => {
    return (
        <AdminLayout>
            <CourseCategoryMainContent />
        </AdminLayout>
    );
};

export default CourseCategoryPage;
