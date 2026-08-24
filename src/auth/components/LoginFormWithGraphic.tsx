// src/auth/components/LoginFormWithGraphic.tsx

import { ArrowLeftFromLine, ArrowRightFromLine, BarChart3, CheckCircle, Eye, EyeOff, Headphones, Key, Mail, Scaling, ShieldCheck, User, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useLogin';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import { loginSchema, LoginPayload } from '../schema/loginSchemas';
import { useFormSubmit } from '@/shared/hooks/useFormSubmit.tsx';
import { ApiLoginPayload } from '../schema/loginDataSchema';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from "framer-motion";
import { RegisterPayload, registerSchema } from '../schema/registerSchemas';
import { useRegister } from '../hooks/useRegister';
import { HeaderCompany } from '@/shared/components/sidebar/SidebarContent';

type BenefitContextType = {
    mainIcon: React.ElementType;
    description: string;
    title: string;
    id: number;
}

const benefitContext: BenefitContextType[] = [
    {
        id: 0,
        mainIcon: Zap as React.ElementType,
        description: 'Proses manual seperti manajemen data calon mahasiswa, verifikasi dokumen pendaftaran, hingga pelacakan status aplikasi universitas dapat dilakukan secara otomatis hanya dengan beberapa klik.',
        title: 'Automasi Tugas'
    },
    {
        id: 1,
        mainIcon: CheckCircle as React.ElementType,
        description: 'Sistem CRM ini dilengkapi dengan validasi data yang ketat pada formulir pendaftaran dan kelengkapan dokumen studi untuk meminimalisir potensi kesalahan input oleh tim konselor pendidikan.',
        title: 'Minim Kesalahan'
    },
    {
        id: 2,
        mainIcon: ShieldCheck as React.ElementType,
        description: 'Seluruh riwayat aktivitas—seperti pembaruan status pendaftaran mahasiswa, unggah dokumen penting, atau persetujuan aplikasi—terekam secara real-time untuk transparansi dan kemudahan pelacakan.',
        title: 'Audit Log'
    },
    {
        id: 3,
        mainIcon: BarChart3 as React.ElementType,
        description: 'Menyajikan analitik data komprehensif melalui grafik tingkat konversi pendaftaran, tren universitas tujuan, serta ringkasan progres calon mahasiswa untuk mendukung keputusan strategis.',
        title: 'Dashboard & Analitik'
    },
    {
        id: 4,
        mainIcon: Headphones as React.ElementType,
        description: 'Tim konselor dapat dengan cepat melacak profil siswa, menangani kendala dokumen pendaftaran visa atau LoA, dan merespons pertanyaan calon mahasiswa secara langsung dari satu platform.',
        title: 'Penyelesaian Cepat'
    },
    {
        id: 5,
        mainIcon: Scaling as React.ElementType,
        description: 'Seiring dengan bertambahnya jumlah calon mahasiswa dan mitra universitas luar negeri, arsitektur sistem didesain agar tetap responsif dan siap menangani ribuan data pendaftaran secara efisien.',
        title: 'Pertumbuhan Data'
    },
];

// ── Floating label input helper ──
const FloatingInput = ({
    id,
    type = 'text',
    label,
    icon: Icon,
    error,
    watch,
    rightSlot,
    inputProps,
}: {
    id: string;
    type?: string;
    label: string;
    icon: React.ElementType;
    error?: string;
    watch?: string;
    rightSlot?: React.ReactNode;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> };
}) => {
    const [focused, setFocused] = useState(false)
    const isFloating = focused || !!watch;

    return (
        <div className="space-y-2">
            <div className={`relative group/${id}`}>
                <Input
                    id={id}
                    type={type}
                    className="pl-10 pr-10 h-11 rounded border-slate-100 bg-slate-50/30 focus:bg-white"
                    {...inputProps}
                    onFocus={(e) => {
                        setFocused(true);
                        inputProps?.onFocus?.(e);
                    }}

                    onBlur={(e) => {
                        setFocused(false);
                        inputProps?.onBlur?.(e);
                    }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <Label
                        htmlFor={id}
                        className={cn(
                            `absolute whitespace-nowrap left-8 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                            `bg-white px-2 duration-500 transition-all`,
                            isFloating ? '!top-0 !text-[10px] !left-4' : ''
                        )}
                    >
                        {label}
                    </Label>
                </div>
                {rightSlot}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    )
};

// ── Main layout ──
const LoginFormWithGraphic: React.FC<{ haveRegister?: boolean }> = ({ haveRegister }) => {
    const [view, setView] = useState<'login' | 'register'>('login');

    return (
        <div className="h-[100dvh] bg-primary/10 flex items-center justify-center">
            <div className="bg-white rounded-md shadow-2xl relative flex flex-col h-full max-h-[900px] w-[100dvw] max-w-[1500px]">
                <div className='flex h-full max-h-[900px] w-full max-w-[1500px]'>
                    <LoginForm onGoRegister={() => setView('register')} view={view} haveRegister={haveRegister} />
                    <RegisterForm onGoLogin={() => setView('login')} view={view} />
                </div>
                <InformationSection
                    onCreateAccount={() => setView(view === 'login' ? 'register' : 'login')}
                    authType={view}
                    haveRegister={haveRegister}
                />
            </div>
        </div>
    );
};

// ── Login Form ──
const LoginForm: React.FC<{ onGoRegister: () => void, view: 'login' | 'register', haveRegister?: boolean }> = React.memo(({ onGoRegister, view, haveRegister }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod] = useState<'email' | 'username'>('email');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        clearErrors,
        watch,
    } = useForm<LoginPayload>({
        resolver: zodResolver(loginSchema),
        defaultValues: { loginMethod: 'email', email: '', username: '', password: '' },
    });

    useEffect(() => {
        setValue('loginMethod', loginMethod);
        clearErrors(['email', 'username']);
    }, [loginMethod, setValue, clearErrors]);

    const { mutateAsync, isPending } = useLogin();

    const { onSubmit } = useFormSubmit<LoginPayload, ApiLoginPayload>({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Login Successful!",
        errorMessage: "Failed to Login.",
        queryKeyToRefetch: ["auth"],
        transformPayload: (data) => {
            const { loginMethod: lm, email, username, password } = data;
            return lm === 'email' ? { email, password } : { username, password };
        },
    });

    return (
        <div className={cn("w-full min-[1025px]:w-[50%] p-8 lg:p-12 h-full flex flex-col items-center justify-between relative shrink-0 transition-all duration-1000", view !== 'login' ? '-translate-x-full min-[1025px]:!translate-x-0' : 'translate-x-0')}>

            <div className={cn("absolute bg-white inset-0 transition-all duration-1000", view !== 'login' ? 'opacity-100 z-2' : 'opacity-0 -z-1')}></div>

            <div className="flex gap-3 items-center w-full justify-start">
                <HeaderCompany />
            </div>

            <div className="max-w-md w-full">
                <div className="header mb-6 flex flex-col gap-4">
                    <h2 className="text-4xl font-[1000] text-center lg:text-left uppercase tracking-tighter text-primary">
                        Welcome Back
                    </h2>
                    <p className="text-slate-400 text-sm tracking-wide">Log in to continue to your account.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <FloatingInput
                        id="email"
                        type="email"
                        label="Email Address"
                        icon={Mail}
                        error={errors.email?.message}
                        watch={watch('email')}
                        inputProps={register('email')}
                    />

                    <FloatingInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        icon={Key}
                        error={errors.password?.message}
                        watch={watch('password')}
                        inputProps={register('password')}
                        rightSlot={
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                {showPassword
                                    ? <EyeOff className="w-4 h-4 text-primary opacity-50" />
                                    : <Eye className="w-4 h-4 text-primary opacity-50" />
                                }
                            </button>
                        }
                    />

                    <button
                        type="submit"
                        className={clsx(
                            'w-full text-white font-black h-11 rounded transition-all duration-300 uppercase text-xs tracking-widest shadow-lg shadow-primary/10',
                            isPending ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-slate-900'
                        )}
                        disabled={isPending}
                    >
                        {isPending ? 'Authenticating...' : 'Log In'}
                    </button>

                </form>
            </div>
            {
                haveRegister
                    ? (
                        <p className="text-center text-sm text-slate-400">
                            Don&apos;t have an account?{' '}
                            <button type="button" onClick={onGoRegister} className="text-primary font-bold hover:underline hover:cursor-pointer">
                                Create Account
                            </button>
                        </p>
                    )
                    : (
                        <div></div>
                    )
            }
        </div>
    );
});
LoginForm.displayName = 'LoginForm';

// ── Register Form ──
const RegisterForm: React.FC<{ onGoLogin: () => void, view: 'login' | 'register' }> = React.memo(({ onGoLogin, view }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
    } = useForm<RegisterPayload>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
    });

    const { mutateAsync, isPending } = useRegister();

    const { onSubmit } = useFormSubmit<RegisterPayload>({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: 'Registration Successful!',
        errorMessage: 'Failed to Register.',
        onSuccess: () => onGoLogin(),
    });

    return (
        <div className={cn("min-[1025px]:w-[50%] w-full p-8 lg:p-12 h-full flex flex-col items-center justify-between relative shrink-0 transition-all duration-1000", view !== 'login' ? '-translate-x-full min-[1025px]:!translate-x-0' : 'translate-x-0')}>

            <div className={cn("absolute bg-white inset-0 transition-all duration-1000", view === 'login' ? 'opacity-100  z-2' : 'opacity-0 -z-1')}></div>

            <div className="flex gap-3 items-center w-full justify-end">
                <HeaderCompany/>
            </div>

            <div className="max-w-md w-full">
                <div className="header mb-6 flex flex-col gap-4">
                    <h2 className="text-4xl font-[1000] text-center lg:text-left uppercase tracking-tighter text-primary">
                        Create Account
                    </h2>
                    <p className="text-slate-400 text-sm tracking-wide">Register to get started with your account.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <FloatingInput
                        id="reg-name"
                        type="text"
                        label="Full Name"
                        icon={User}
                        error={errors.name?.message}
                        watch={watch('name')}
                        inputProps={register('name', { required: 'Name is required' })}
                    />

                    <FloatingInput
                        id="reg-email"
                        type="email"
                        label="Email Address"
                        icon={Mail}
                        error={errors.email?.message}
                        watch={watch('email')}
                        inputProps={register('email', { required: 'Email is required' })}
                    />

                    <FloatingInput
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        icon={Key}
                        error={errors.password?.message}
                        watch={watch('password')}
                        inputProps={register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
                        rightSlot={
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4 text-primary opacity-50" /> : <Eye className="w-4 h-4 text-primary opacity-50" />}
                            </button>
                        }
                    />

                    <FloatingInput
                        id="reg-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        label="Confirm Password"
                        icon={Key}
                        error={errors.password_confirmation?.message}
                        watch={watch('password_confirmation')}
                        inputProps={register('password_confirmation', {
                            required: 'Please confirm your password',
                            validate: (val) => val === watch('password') || 'Passwords do not match',
                        })}
                        rightSlot={
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4 text-primary opacity-50" /> : <Eye className="w-4 h-4 text-primary opacity-50" />}
                            </button>
                        }
                    />

                    <button
                        type="submit"
                        className={clsx(
                            'w-full text-white font-black h-11 rounded transition-all duration-300 uppercase text-xs tracking-widest shadow-lg shadow-primary/10',
                            isPending ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-slate-900'
                        )}
                        disabled={isPending}
                    >
                        {isPending ? 'Registering...' : 'Register'}
                    </button>

                </form>
            </div>
            <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <button type="button" onClick={onGoLogin} className="text-primary font-bold hover:underline">
                    Log In
                </button>
            </p>
        </div>
    );
});
RegisterForm.displayName = 'RegisterForm';

// ── Information / Carousel Section ──
// Carousel state kini lokal di sini, sehingga perubahan slide setiap
// beberapa detik TIDAK memicu re-render pada LoginForm / RegisterForm.
const InformationSection: React.FC<{
    onCreateAccount: () => void;
    authType: 'login' | 'register';
    haveRegister?: boolean;
}> = ({ onCreateAccount, authType, haveRegister }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(0);
    const [isChange, setIsChange] = useState(false);

    const Icon = benefitContext[selectedIndex].mainIcon;
    const SecondIcon = benefitContext[previousIndex].mainIcon;

    return (
        <div
            className={cn(
                'absolute w-[50%] h-full bg-white transition-all duration-1000 max-[1025px]:hidden',
                authType === "login"
                    ? "left-1/2 rounded-r-md"
                    : "left-0 rounded-l-md"
            )}
        >
            <div className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors duration-1500 ease-in-out",
                selectedIndex % 2 === 0 ? 'bg-[color-mix(in_srgb,var(--secondary),black_10%)]' : 'bg-primary'
            )}>
                {/* Carousel content — desktop only */}
                <div className="hidden lg:flex w-3/4 flex-col items-center justify-center relative pb-20">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col relative items-center" style={{ perspective: 1000 }}>
                            <motion.div
                                key={selectedIndex}
                                initial={{ rotateY: isChange ? 180 : 0 }}
                                animate={{ rotateY: 0 }}
                                transition={isChange ? { duration: 0.8, ease: "easeInOut" } : { duration: 0 }}
                                style={{ transformStyle: "preserve-3d", position: "relative", width: 96, height: 96 }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                                    <Icon className={cn("w-24 h-24", selectedIndex % 2 === 0 ? 'text-primary-foreground' : 'text-secondary')} />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                                    <SecondIcon className={cn("w-24 h-24", previousIndex % 2 === 0 ? 'text-primary-foreground' : 'text-secondary')} />
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-8 text-center flex flex-col gap-1">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={`title-${selectedIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className={cn("text-4xl font-black text-primary-foreground",
                                        selectedIndex % 2 !== 0 ? 'text-primary-foreground' : 'text-primary'
                                    )}
                                >
                                    {benefitContext[selectedIndex].title}
                                </motion.h2>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`desc-${selectedIndex}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
                                    className={cn("text-xs text-primary-foreground/60",
                                        selectedIndex % 2 !== 0 ? 'text-primary-foreground/60' : 'text-primary/60'
                                    )}
                                >
                                    {benefitContext[selectedIndex].description}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Title only — mobile */}
                <div className="lg:hidden text-center">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={`mobile-title-${selectedIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="text-2xl font-black text-primary-foreground"
                        >
                            {benefitContext[selectedIndex].title}
                        </motion.h2>
                    </AnimatePresence>
                </div>

                {/* Bottom bar */}
                <div className="lg:absolute lg:bottom-10 flex flex-col gap-2 items-center mt-4 lg:mt-0">
                    <TimerCountDown
                        onIndexChange={setSelectedIndex}
                        onPreviousChange={setPreviousIndex}
                        onChange={setIsChange}
                        length={benefitContext.length}
                        showDots
                        selectedIndex={selectedIndex}
                    />
                    {
                        haveRegister && (
                            <Button
                                onClick={onCreateAccount}
                                className={cn("mt-4 !p-6 border-3 cursor-pointer flex gap-2",
                                    selectedIndex % 2 === 0 ? 'bg-primary border-secondary text-primary-foreground font-semibold hover:bg-slate-900' : 'bg-secondary border-primary font-semibold text-primary-foreground hover:bg-secondary/80'
                                )}
                            >
                                {authType === 'login'
                                    ? 'Sign Up'
                                    : 'Sign In'
                                }
                                {
                                    authType === 'login' 
                                    ? <ArrowRightFromLine />
                                    : <ArrowLeftFromLine />
                                }
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

// ── Timer / dots ──
const DURATION = 5;

const TimerCountDown = (props: {
    onIndexChange: (val: number) => void;
    onChange: (val: boolean) => void;
    onPreviousChange: (val: number) => void;
    length: number;
    showDots?: boolean;
    selectedIndex: number
}) => {
    // Destructure agar dependency array useEffect stabil dan tidak
    // membuat ulang interval setiap kali parent re-render.
    const { onIndexChange, onChange, onPreviousChange, length } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        onIndexChange(selectedIndex);
    }, [selectedIndex, onIndexChange]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedIndex((prev) => {
                onChange(true);
                onPreviousChange(prev);
                return (prev + 1) % length;
            });
        }, DURATION * 1000);
        return () => clearInterval(interval);
    }, [onChange, onPreviousChange, length]);

    return (
        <div className={cn("flex gap-1 justify-center items-end mt-8", !props.showDots && "hidden lg:flex")}>
            {Array.from({ length }).map((_, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "relative w-6 h-1 rounded-full overflow-hidden cursor-pointer",
                        idx < selectedIndex
                        ? 'bg-primary-foreground'
                        : selectedIndex % 2 !== 0 ? 'bg-secondary' : 'bg-primary'
                    )}
                    onClick={() => {
                        if (idx === selectedIndex) return;
                        onChange(true);
                        onPreviousChange(selectedIndex);
                        setSelectedIndex(idx);
                    }}
                >
                    {idx === selectedIndex && (
                        <motion.div
                            key={selectedIndex}
                            className="absolute inset-0 bg-primary-foreground origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: DURATION, ease: "linear" }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default LoginFormWithGraphic;        