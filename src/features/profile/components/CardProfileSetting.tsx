import { useAuth } from '@/auth/context/AuthProvider';
import { LoginData } from '@/auth/response/loginResponseSchema';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useGetUserLogin from '@/services/profile';
import { useUpdateProfile } from '@/services/profile';
import { UpdateProfile, UpdateProfileSchema } from '@/services/profile';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

const CardProfileSetting: React.FC = () => {
    const { relogin } = useAuth();
    const { mutateAsync, isPending } = useUpdateProfile();  // Assuming `useCreateUser` is a hook for creating the user
    const { register, setError, handleSubmit, formState: { errors }, reset } = useForm<UpdateProfile>({
        resolver: zodResolver(UpdateProfileSchema),  // Assuming you have a Zod schema for validation
    });  // Adjust the form type to match the expected structure

    const { data: userFetch, isFetching, isSuccess, refetch } = useGetUserLogin();

    useEffect(() => {
        if (userFetch && isSuccess) {
            reset({
                name: userFetch.data.name,
                email: userFetch.data.email,
                phone: userFetch.data.phone,
            });
        }
    }, [userFetch]);

    // Use the form submit handler
    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending: isPending,
        setError: setError,
        successMessage: "User updated successfully!",
        errorMessage: "Failed to update user.",
        queryKeyToRefetch: ["user"], // Assuming you want to refetch the `users` query
        transformPayload: (formData) => ({ 
            id: userFetch?.data?.id ?? 'me', 
            data: formData 
        }),
        onSuccess: () => {
            const userFetch = refetch();
            if (userFetch) {
                userFetch.then((res) => {
                    if (res.data) {
                        relogin({
                            ...res.data.data,
                            roles: res.data.data.roles ?? [],
                            permissions: res.data.data.permissions ?? [],
                            photo_url: res.data.data.photo_url ?? undefined,
                        } as LoginData);
                    }
                });
            }
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('name')}
                            disabled={isFetching}
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Phone
                        </label>
                        <input
                            id="phone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('phone')}
                            disabled={isFetching}
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('email')}
                            disabled={isFetching}
                        />
                    </div>
                    <Button type='submit' disabled={isPending}>Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default CardProfileSetting