import { Button } from '@/components/ui/button'
import { useDeletePermission } from '@/services/permission/hooks/useDeletePermission'
import { SinglePermissionResponse } from '@/services/permission/response/IndexPermissionResponse'
import { useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    permission: SinglePermissionResponse
}

const RemovePermission: React.FC<Props> = ({ permission }) => {
    const { mutate } = useDeletePermission();

    const queryClient = useQueryClient();

    const onRemove = (id: number) => {
        toast.loading('Removing permission...', { id: 'remove-permission' });

        mutate({ id: id }, {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    predicate: (query) => query.queryKey.some((key) => ['permission-list'].includes(key as string))
                });

                toast.success('Permission removed successfully', { id: 'remove-permission' });
            },
            onError: (mutationError) => {
                toast.error(mutationError?.message || 'Failed to remove permission', { id: 'remove-permission' });
            }
        });
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-red-600 hover:text-red-800"
            onClick={() => onRemove(permission.id)}
            aria-label="Delete"
        >
            <Trash className="h-4 w-4" />
        </Button>
    )
}

export default RemovePermission