// file: src/components/ui/breadcrumb.tsx

import React from "react";
import { Link } from "react-router"; // Pastikan menggunakan react-router-dom
import { cn } from "@/lib/utils";
import {
    Breadcrumb as ShadBreadcrumb,
    BreadcrumbItem as ShadBreadcrumbItem,
    BreadcrumbLink as ShadBreadcrumbLink,
    BreadcrumbList as ShadBreadcrumbList,
    BreadcrumbSeparator as ShadBreadcrumbSeparator,
    BreadcrumbPage,
    BreadcrumbList, // Kita akan gunakan ini untuk konsistensi di mode kustom
} from "@/components/ui/breadcrumb";

// --- BAGIAN 1: DEFINISI KOMPONEN DASAR (UNTUK MODE KUSTOM) ---

const BreadcrumbRoot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
));
BreadcrumbRoot.displayName = "BreadcrumbRoot";

const BreadcrumbTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-lg font-semibold text-gray-800 dark:text-gray-200", className)}
        {...props}
    />
));
BreadcrumbTitle.displayName = "BreadcrumbTitle";

// --- BAGIAN 2: INTERFACE UNTUK MODE DEFAULT ---

interface BreadcrumbPath {
    label: string;
    path: string;
    clickable?: boolean; // Sesuai dengan permintaan awal Anda
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    items?: BreadcrumbPath[];
}

// --- BAGIAN 3: KOMPONEN UTAMA YANG "PINTAR" ---

const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
    ({ className, title, items, children, ...props }, ref) => {
        // Cek apakah pengguna memberikan children secara eksplisit.
        const isCustom = React.Children.count(children) > 0;

        // --- MODE KUSTOM ---
        // Jika ada children, serahkan kontrol penuh kepada pengguna.
        if (isCustom) {
            return (
                <BreadcrumbRoot ref={ref} className={className} {...props}>
                    {children}
                </BreadcrumbRoot>
            );
        }

        // --- MODE DEFAULT ---
        // Jika tidak ada children, render tampilan default persis seperti yang diminta.
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-between px-6 pt-6 bg-white dark:bg-gray-900",
                    className
                )}
                {...props}
            >
                {/* Page Title */}
                {title && <BreadcrumbTitle>{title}</BreadcrumbTitle>}

                {/* Breadcrumb Navigation */}
                {items && items.length > 0 && (
                    <ShadBreadcrumb>
                        <BreadcrumbList>
                            {items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ShadBreadcrumbItem>
                                        {/* Logika rendering persis seperti di komponen awal Anda */}
                                        {index !== items.length - 1 && item.clickable === false ? (
                                            <span className="text-gray-500">{item.label}</span>
                                        ) : (
                                            <ShadBreadcrumbLink asChild>
                                                <Link to={item.path}>{item.label}</Link>
                                            </ShadBreadcrumbLink>
                                        )}
                                    </ShadBreadcrumbItem>

                                    {index < items.length - 1 && <ShadBreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </ShadBreadcrumb>
                )}
            </div>
        );
    }
);
Breadcrumb.displayName = "Breadcrumb";

// --- BAGIAN 4: MENYATUKAN SEMUANYA ---
// "Menempelkan" komponen dasar ke komponen utama agar bisa diakses
// seperti <Breadcrumb.Title>, <Breadcrumb.Nav>, dll.
export default Object.assign(Breadcrumb, {
    Title: BreadcrumbTitle,
    Nav: ShadBreadcrumb,
    List: ShadBreadcrumbList,
    Item: ShadBreadcrumbItem,
    Link: ShadBreadcrumbLink,
    Separator: ShadBreadcrumbSeparator,
    Page: BreadcrumbPage,
});