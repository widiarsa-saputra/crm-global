import React from 'react';
import LessonMainContent from '../components/LessonMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const LessonPage: React.FC = () => {
    return (
        <AdminLayout>
            <LessonMainContent />
        </AdminLayout>
    );
};

export default LessonPage;
