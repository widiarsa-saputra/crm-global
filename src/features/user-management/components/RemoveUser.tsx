import { Button } from '@/components/ui/button'
import { useDeleteUser } from '@/services/user/hooks/useDeleteUser'
import { SingleUserResponse } from '@/services/user/response/IndexUserResponse'
import { useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type Props = {
    user: SingleUserResponse
}

const RemoveUser: React.FC<Props> = ({ user }) => {
    const { mutate } = useDeleteUser();

    const queryClient = useQueryClient();

    const onRemove = (id: string) => {
        toast.loading('Removing user...', { id: 'remove-user' });

        mutate({ id: id }, {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    predicate: (query) => query.queryKey.some((key) => ['user-list'].includes(key as string))
                });

                toast.success('User removed successfully', { id: 'remove-user' });
            },
            onError: (mutationError) => {
                toast.error(mutationError?.message || 'Failed to remove user', { id: 'remove-user' });
            }
        });
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-red-600 hover:text-red-800"
            onClick={() => onRemove(user.id)}
            aria-label="Delete"
        >
            <Trash className="h-4 w-4" />
        </Button>
    )
}

export default RemoveUser