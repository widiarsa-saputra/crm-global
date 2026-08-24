import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import useIndexRole from '@/services/role/hooks/useIndexRole';
import { SingleUserResponse } from '@/services/user/response/IndexUserResponse';
import useSyncUserRoles from '@/services/user-role/hooks/useSyncUserRoles';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';
import { SyncUserRoles } from '@/services/user-role/schema/SyncUserRolesSchema';
import { ShieldPlus } from 'lucide-react';
import SectionLoader from '@/shared/components/loader/SectionLoader';

type Props = {
    user: SingleUserResponse;
};

const AssignRoleModal: React.FC<Props> = ({ user }) => {
    const [open, setOpen] = React.useState(false);

    const { data: rolesData, isFetching: isRolesFetching } = useIndexRole({
        // params: { paginate: 0 } 
    });

    const { mutateAsync, isPending } = useSyncUserRoles();
    const { control, handleSubmit, reset, setError } = useForm<SyncUserRoles>();

    useEffect(() => {
        if (open && user.roles) {
            reset({
                user_id: user.id,
                // Mengirimkan 'name' dari role, bukan 'id'
                roles: user.roles.map(role => role.name),
            });
        }
    }, [open, user, reset]);

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "User roles updated successfully!",
        errorMessage: "Failed to update user roles.",
        queryKeyToRefetch: ["user-list"],
        onSuccess: () => {
            setOpen(false);
        },
    });
    
    const roles = Array.isArray(rolesData?.data) ? rolesData.data : [];

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title={`Assign Roles to ${user.name}`}
            description="Select the roles to be assigned to this user."
            trigger={
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setOpen(true)}
                    aria-label="Assign Roles"
                >
                    <ShieldPlus className="h-4 w-4" />
                </Button>
            }
        >
            {isRolesFetching ? <SectionLoader text="Loading roles..." /> : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="roles"
                        control={control}
                        render={({ field }) => (
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map(role => {
                                    // Pengecekan menggunakan 'role.name'
                                    const isChecked = field.value?.includes(role.name);
                                    return (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => {
                                                    const currentRoles = field.value || [];
                                                    // Logika untuk menambah/menghapus 'role.name'
                                                    const newRoles = checked
                                                        ? [...currentRoles, role.name]
                                                        : currentRoles.filter((name: string) => name !== role.name);
                                                    field.onChange(newRoles);
                                                }}
                                            />
                                            <Label htmlFor={`role-${role.id}`} className="font-normal">
                                                {role.display_name}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    />
                    <div className="flex items-center justify-end mt-6 gap-2">
                        <Button type='button' variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                            {isPending ? 'Submitting...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default AssignRoleModal;