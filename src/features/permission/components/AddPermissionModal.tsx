import { Button } from '@/components/ui/button'
import { Modal } from '@/shared/components/modal/Modal'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormSubmit } from '@/shared/hooks/useFormSubmit'
import { FormField } from '@/shared/components/form/FormField'
import useCreatePermission from '@/services/permission/hooks/useCreatePermission'
import { CreatePermission } from '@/services/permission/schema/CreatePermissionSchema'

const AddPermissionModal: React.FC = () => {
    const [open, setOpen] = useState(false)

    const { mutateAsync, isPending } = useCreatePermission()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreatePermission>()

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
        if (!open) {
            reset({
                display_name: "",
                group: "",
                name: "",
            })
        }
    }, [open, reset])

    const fields = [
        { name: "display_name", label: "Display Name", placeholder: "Enter display name" },
        { name: "group", label: "Group", placeholder: "Enter group" },
        { name: "name", label: "Name", placeholder: "Enter name" },
    ]

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title="Create Permission"
            description="Fill the form to create a new permission."
            trigger={
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2  ">
                    <Plus className="h-4 w-4" />
                    Add Permission
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

export default AddPermissionModal
