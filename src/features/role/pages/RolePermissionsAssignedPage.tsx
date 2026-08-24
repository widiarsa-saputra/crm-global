import React from 'react'
import RolePermissionManagement from '../components/RolePermissionManagement'
import AdminLayout from '@/layouts/AdminLayout'

const RolePermissionsAssignedPage: React.FC = () => {
    return (
       <AdminLayout>
         <RolePermissionManagement />
       </AdminLayout>
    )
}

export default RolePermissionsAssignedPage