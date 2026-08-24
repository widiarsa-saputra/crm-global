import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import CourseMainContent from '../components/CourseMainContent';

export const CoursePage: React.FC = () => {
    return (
        <AdminLayout>
            <CourseMainContent />
        </AdminLayout>
    );
};
