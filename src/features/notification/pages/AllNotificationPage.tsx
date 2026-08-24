import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import NotificationsPage from '@/shared/components/notification/pages/NotificationsPage'

const AllNotificationPage: React.FC = () => {
    return (
        <AdminLayout>
            <NotificationsPage />
        </AdminLayout>
    )
}

export default AllNotificationPage