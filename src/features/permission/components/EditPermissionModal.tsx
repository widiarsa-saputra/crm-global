import { Button } from '@/components/ui/button'
import { Modal } from '@/shared/components/modal/Modal'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormSubmit } from '@/shared/hooks/useFormSubmit'
import { FormField } from '@/shared/components/form/FormField'
import { SinglePermissionResponse } from '@/services/permission'
import { useUpdatePermission } from '@/services/permission'
import { UpdatePermission } from '@/services/permission'

type Props = {
    permission: SinglePermissionResponse
}

const EditPermissionModal: React.FC<Props> = ({ permission }) => {
    const [open, setOpen] = useState(false)

    const { mutateAsync, isPending } = useUpdatePermission()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ id: number; data: UpdatePermission }>()

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Permission created successfully!",
        errorMessage: "Failed to create permission.",
        queryKeyToRefetch: ["permission-list"],
        onSuccess: () => {
            setOpen(false)
        },
    })

    useEffect(() => {
        if (open && permission) {
            reset({
                id: Number(permission.id),
                data: {
                    display_name: permission.display_name,
                    group: permission.group,
                },
            });
        }
    }, [open, permission]);

    const fields = [
        { name: "data.display_name", label: "Display Name", placeholder: "Enter display name" },
        { name: "data.group", label: "Group", placeholder: "Enter group" },
    ]

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title="Edit Permission"
            description="Fill the form to edit the permission."
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

export default EditPermissionModal