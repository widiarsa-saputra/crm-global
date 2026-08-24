import React, { useRef } from 'react';
import { useAuth } from '@/auth/context/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/lib/utils';
import { Mail, Loader2, Camera } from 'lucide-react';
import { useChangePhoto } from '@/services/profile';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit';
import { useForm } from 'react-hook-form';
import { ChangePhoto } from '@/services/profile';
import { toast } from 'sonner';
import { useGetUserLogin } from '@/services/profile';

const CardProfileImage: React.FC = () => {
    // 1. Setup hooks dan referensi
    const { user, relogin } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutateAsync, isPending } = useChangePhoto();
    const { handleSubmit, setError, setValue } = useForm<ChangePhoto>();
    const { refetch } = useGetUserLogin();

    // 2. Konfigurasi handler untuk submit form (meskipun tidak ada tombol submit)
    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Photo updated successfully!",
        errorMessage: "Failed to update photo.",
        queryKeyToRefetch: ["user"],
        onSuccess: () => {
            // Setelah berhasil, fetch ulang data user dan perbarui konteks auth
            refetch().then((res) => {
                if (res.data) {
                    relogin({
                        ...res.data.data,
                        roles: res.data.data.roles ?? [],
                        permissions: res.data.data.permissions ?? [],
                        photo_url: res.data.data.photo_url ?? undefined,
                    });
                }
            });
        },
    });

    // 3. Fungsi yang dipicu saat file dipilih
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setValue("photo", files); // Set nilai 'photo' untuk react-hook-form
            setValue("_method", "PUT"); // Set nilai '_method'
            handleSubmit(onSubmit)(); // Langsung trigger submit
        } else {
            toast.error("No file selected.");
        }
    };

    // 4. Fungsi untuk memicu klik pada input file yang tersembunyi
    const handleAvatarClick = () => {
        if (!isPending) {
            fileInputRef.current?.click();
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                    <div
                        className="relative group cursor-pointer"
                        onClick={handleAvatarClick}
                        title="Change profile photo"
                    >
                        <Avatar className="h-24 w-24">
                            {/* Nanti ganti dengan user.photo_url jika ada */}
                            <AvatarImage src={user?.photo_url || "/profile.jpg"} alt={user?.name} />
                            <AvatarFallback>{getInitials(user?.name || '')}</AvatarFallback>
                        </Avatar>

                        {/* Loading Overlay */}
                        {isPending && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                            </div>
                        )}

                        {/* Change Icon Overlay on Hover */}
                        {!isPending && (
                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/50 flex items-center justify-center rounded transition-opacity duration-300">
                                <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                        )}
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                    />

                    <h2 className="mt-4 text-xl font-bold">{user?.name ?? ''}</h2>
                    <p className="text-muted-foreground">{user?.roles?.[0].display_name}</p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-1 h-4 w-4" />
                        <span>{user?.email}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CardProfileImage;