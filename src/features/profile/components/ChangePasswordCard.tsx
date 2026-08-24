import { useAuth } from '@/auth/context/AuthProvider';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePassword } from '@/services/profile/hooks/useChangePassword';
import { ChangePassword, ChangePasswordSchema } from '@/services/profile/schema/ChangePasswordSchema';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const ChangePasswordCard: React.FC = () => {
    const { logout } = useAuth();  // Assuming you have a logout function in your auth context
    const { mutateAsync, isPending } = useChangePassword();  // Assuming `useCreateUser` is a hook for creating the user
    const { register, setError, handleSubmit, formState: { errors }, reset } = useForm<ChangePassword>({
        resolver: zodResolver(ChangePasswordSchema),  // Assuming you have a Zod schema for validation
    });  // Adjust the form type to match the expected structure
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Use the form submit handler
    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending: isPending,
        setError: setError,
        successMessage: "Password updated successfully!",
        errorMessage: "Failed to update password.",
        queryKeyToRefetch: ["user"], // Assuming you want to refetch the `users` query
        transformPayload: (formData) => ({ id: 'me', data: formData }),
        onSuccess: () => {
            console.log("Password changed successfully");
            reset(); // Reset the form after successful submission
            logout(); // Call the logout function after successful submission

        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Set a new password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className="grid gap-2">
                        <label htmlFor="old_password" className="text-sm font-medium">
                            Old Password
                        </label>
                        <div className="relative">
                            <input
                                id="old_password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder='********'
                                type={showOldPassword ? 'text' : 'password'}
                                {...register("old_password")} // Register the input with react-hook-form
                                disabled={isPending} // Disable the input when the form is pending
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                tabIndex={-1}
                            >
                                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.old_password && (
                            <span className="text-red-500 text-sm">{errors.old_password.message}</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="new_password" className="text-sm font-medium">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="new_password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder='********'
                                type={showNewPassword ? 'text' : 'password'}
                                {...register("new_password")} // Register the input with react-hook-form
                                disabled={isPending} // Disable the input when the form is pending
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.new_password && (
                            <span className="text-red-500 text-sm">{errors.new_password.message}</span>
                        )}
                    </div>
                    <Button disabled={isPending}>Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordCard