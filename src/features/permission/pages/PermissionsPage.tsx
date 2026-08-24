import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import PermissionPageContent from '../components/PermissionPageContent'

const PermissionsPage: React.FC = () => {
    return (
        <AdminLayout>
            <PermissionPageContent />
        </AdminLayout>
    )
}

export default PermissionsPage