import { Button } from '@/components/ui/button'
import { Modal } from '@/shared/components/modal/Modal'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useCreateUser from '@/services/user/hooks/useCreateUser'
import { CreateUser } from '@/services/user/schema/CreateUserSchema'
import { useFormSubmit } from '@/shared/hooks/useFormSubmit'
import { FormField } from '@/shared/components/form/FormField'

const AddUserModal: React.FC = () => {
    const [open, setOpen] = useState(false)

    const { mutateAsync, isPending } = useCreateUser()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateUser>()

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "User created successfully!",
        errorMessage: "Failed to create user.",
        queryKeyToRefetch: ["user-list"],
        onSuccess: () => {
            setOpen(false)
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                name: undefined,
                email: undefined,
                phone: undefined,
                password: undefined,
            })
        }
    }, [open, reset])

    const fields = [
        { name: "name", label: "Full Name", placeholder: "Enter full name" },
        { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
        { name: "phone", label: "WhatsApp", placeholder: "Enter WhatsApp number" },
        { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
    ]

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title="Create User"
            description="Fill the form to create a new user."
            trigger={
                <Button onClick={() => setOpen(true)} className="flex items-center gap-2  ">
                    <Plus className="h-4 w-4" />
                    Add User
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

export default AddUserModal
