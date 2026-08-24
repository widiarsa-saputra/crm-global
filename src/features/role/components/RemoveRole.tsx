import { Button } from '@/components/ui/button'
import { useDeleteRole } from '@/services/role/hooks/useDeleteRole'
import { RoleResponse } from '@/services/role/response/IndexRoleResponse'
import { useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    role: RoleResponse
}

const RemoveRole: React.FC<Props> = ({ role }) => {
    const { mutate } = useDeleteRole();

    const queryClient = useQueryClient();

    const onRemove = (id: number) => {
        toast.loading('Removing role...', { id: 'remove-role' });

        mutate({ id: id }, {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    predicate: (query) => query.queryKey.some((key) => ['role-list'].includes(key as string))
                });

                toast.success('Role removed successfully!', { id: 'remove-role' });
            },
            onError: (mutationError) => {
                toast.error(mutationError?.message || 'Failed to remove role!', { id: 'remove-role' });
            }
        });
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-red-600 hover:text-red-800"
            onClick={() => onRemove(role.id)}
            aria-label="Delete"
        >
            <Trash className="h-4 w-4" />
        </Button>
    )
}

export default RemoveRole