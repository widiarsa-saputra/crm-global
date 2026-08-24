import { Button } from '@/components/ui/button'
import { Modal } from '@/shared/components/modal/Modal'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormSubmit } from '@/shared/hooks/useFormSubmit'
import { FormField } from '@/shared/components/form/FormField'
import { SingleUserResponse } from '@/services/user'
import { useUpdateUser } from '@/services/user'
import { UpdateUser } from '@/services/user'

type Props = {
    user: SingleUserResponse
}

const EditUserModal: React.FC<Props> = ({ user }) => {
    const [open, setOpen] = useState(false)

    const { mutateAsync, isPending } = useUpdateUser()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ id: string; data: UpdateUser }>()

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
        if (open && user) {
            reset({
                id: user.id,
                data: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone || undefined,
                    password: "",
                },
            });
        }
    }, [open, user]);

    const fields = [
        { name: "data.name", label: "Full Name", placeholder: "Enter full name" },
        { name: "data.email", label: "Email", type: "email", placeholder: "Enter email" },
        { name: "data.phone", label: "WhatsApp", placeholder: "Enter WhatsApp number" },
        { name: "data.password", label: "Password", type: "password", placeholder: "Enter password" },
    ]

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            size="lg"
            title="Create User"
            description="Fill the form to create a new user."
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

export default EditUserModal