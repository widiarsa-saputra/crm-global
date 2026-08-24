import React from 'react';
import LessonSectionMainContent from '../components/LessonSectionMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const LessonSectionPage: React.FC = () => {
    return (
        <AdminLayout>
            <LessonSectionMainContent />
        </AdminLayout>
    );
};

export default LessonSectionPage;
