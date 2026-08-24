import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

/**
 * Memotong teks dan menambahkan ellipsis jika melebihi panjang maksimal.
 *
 * @param text - Teks asli
 * @param maxLength - Panjang maksimal sebelum dipotong
 * @param suffix - (Opsional) Suffix setelah dipotong, default: "..."
 * @returns Teks yang sudah dipotong jika perlu
 */
export function truncateText(text: string, maxLength: number, suffix = "..."): string {
  if (typeof text !== "string") return "";
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
}

export function formatDateToLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const tailwindBgColorClasses = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
  'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

// Fungsi untuk menentukan text color berdasarkan shade (angka di class)
function getTextColorFromBgClass(bgClass: string): string {
  // bgClass contoh: 'bg-red-500'
  // ambil angka shade-nya (misal '500')
  const shadeMatch = bgClass.match(/-(\d{3})$/);
  const shade = shadeMatch ? parseInt(shadeMatch[1], 10) : 500;

  // Anggap shade >= 600 itu gelap → text putih, lainnya → text hitam
  return shade >= 600 ? 'text-white' : 'text-black';
}

export function getRandomBgAndTextColor(): { bgColor: string; textColor: string } {
  const bgColor = tailwindBgColorClasses[
    Math.floor(Math.random() * tailwindBgColorClasses.length)
  ];
  const textColor = getTextColorFromBgClass(bgColor);
  return { bgColor, textColor };
}


export const nullableSchema = <T extends z.ZodRawShape>(dataSchema: z.ZodObject<T>) => {
  return Object.fromEntries(
    Object.entries(dataSchema.shape).map(([key, value]) => {
      return [key, value.nullable()];
    })
  ) as {
      [K in keyof typeof dataSchema.shape]:
      z.ZodNullable<(typeof dataSchema.shape)[K]>
    }
}

export type OpenStateModifier = 'idle' | 'create' | 'update' | 'delete';


export const dynamicPageFunc = (pathname: string) => pathname === '/'
  ? 'Dashboard'
  : pathname
    .split('/')
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());


export const onCopy = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.info(`${text} berhasil di salin!`, { id: 'copy' })
}



export const positionClass = {
  top: {
    start: "top-1 left-1 mb-2",
    center: "top-1 left-1/2 -translate-x-1/2 mb-2",
    end: "top-1 right-1 mb-2",
  },
  right: {
    start: "right-1 top-1 ml-2",
    center: "right-1 top-1/2 -translate-y-1/2 ml-2",
    end: "right-1 bottom-1 ml-2",
  },
  bottom: {
    start: "bottom-1 left-1 mt-2",
    center: "bottom-1 left-1/2 -translate-x-1/2 mt-2",
    end: "bottom-1 right-1 mt-2",
  },
  left: {
    start: "left-1 top-1 mr-2",
    center: "left-1 top-1/2 -translate-y-1/2 mr-2",
    end: "left-1 bottom-1 mr-2",
  },
};


export const IsActiveEnum = ['active', 'inactive'] as const

export const difficultyOptions = [
  { label: 'Semua Tingkat', value: '' },
    { value: 'easy', label: 'Mudah', color: 'text-green-500' },
    { value: 'medium', label: 'Sedang', color: 'text-yellow-500' },
    { value: 'hard', label: 'Sulit', color: 'text-red-500' },
    { value: 'hots', label: 'HOTS', color: 'text-purple-500' },
];

export const getDifficultyColor = (diff: string) => {
    switch (diff) {
        case 'easy': return 'bg-green-500 text-white';
        case 'medium': return 'bg-yellow-500 text-white';
        case 'hard': return 'bg-red-500 text-white';
        case 'hots': return 'bg-purple-500 text-white';
        default: return 'bg-gray-200 text-gray-800';
    }
};

export const getDifficultyLabel = (diff: string) => difficultyOptions.find(o => o.value === diff)?.label || diff;