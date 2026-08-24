import React from 'react';
import PaymentMainContent from '../components/PaymentMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const PaymentPage: React.FC = () => {
    return (
        <AdminLayout>
            <PaymentMainContent />
        </AdminLayout>
    );
};

export default PaymentPage;
