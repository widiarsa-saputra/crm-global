import React from 'react';
import LessonSectionFileMainContent from '../components/LessonSectionFileMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const LessonSectionFilePage: React.FC = () => {
    return (
        <AdminLayout>
            <LessonSectionFileMainContent />
        </AdminLayout>
    );
};

export default LessonSectionFilePage;
