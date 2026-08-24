import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import RolePageContent from '../components/RolePageContent'

const RolePage: React.FC = () => {
    return (
        <AdminLayout>
            <RolePageContent />
        </AdminLayout>
    )
}

export default RolePage