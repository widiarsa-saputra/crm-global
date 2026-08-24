import { Button } from '@/components/ui/button'
import { Modal } from '@/shared/components/modal/Modal'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormSubmit } from '@/shared/hooks/useFormSubmit'
import { FormField } from '@/shared/components/form/FormField'
import { RoleResponse } from '@/services/role'
import { useUpdateRole } from '@/services/role'
import { UpdateRole } from '@/services/role'

type Props = {
    role: RoleResponse
}

const EditRoleModal: React.FC<Props> = ({ role }) => {
    const [open, setOpen] = useState(false)

    const { mutateAsync, isPending } = useUpdateRole()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ id: number; data: UpdateRole }>()

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Role updated successfully.",
        errorMessage: "Failed to update role.",
        queryKeyToRefetch: ["role-list"],
        onSuccess: () => {
            setOpen(false)
        },
    })

    useEffect(() => {
        if (open && role) {
            reset({
                id: role.id,
                data: {
                    display_name: role.display_name
                },
            });
        }
    }, [open, role]);

    const fields = [
        { name: "data.display_name", label: "Display Name", placeholder: "Enter display name" }
    ]

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title="Edit Role"
            description="Edit the role with the required permissions."
            trigger={
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setOpen(true)}
                    aria-label="Edit"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            }
        >
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field) => (
                    <FormField
                        key={field.name}
                        {...field}
                        register={register}
                        errors={errors}
                    />
                ))}

                <div className="flex items-center justify-end mt-4 gap-2">
                    <Button type='button' variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" className=" " disabled={isPending}>
                        {isPending ? 'Submitting...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default EditRoleModal