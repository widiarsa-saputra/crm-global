# Pola Implementasi Filter Halaman (Page Filter Pattern)

Dokumen ini menjelaskan pola standar untuk membuat fitur filter pada halaman data (seperti di `CourseMainContent.tsx`). Pola ini memisahkan antara state filter yang aktif (dikirim ke API) dan state filter sementara (digunakan di dalam drawer/laci antarmuka pengguna), serta menambahkan label-label aktif di bagian atas tabel.

## 1. Definisi Initial State
Definisikan struktur objek filter bawaan (`initialFilterState`). Objek ini tidak hanya menyimpan ID untuk dikirim ke API, tetapi juga menampung data tambahan yang berguna untuk UI (misalnya `category_data` untuk mengambil nama kategori).

```tsx
const initialFilterState: {
    course_category_id: string | undefined;
    course_category_data: CourseCategoryEntity | undefined;
    level: string | undefined;
    status: string | undefined;
    min_price: string | undefined;
    max_price: string | undefined;
} = {
    course_category_id: undefined,
    course_category_data: undefined,
    level: undefined,
    status: undefined,
    min_price: undefined,
    max_price: undefined,
};
```

## 2. Inisialisasi State
Gunakan dua state terpisah untuk filter, dan satu state array untuk label yang akan ditampilkan di layar.

```tsx
// State filter aktif (dikirim ke API)
const [filter, setFilter] = useState(initialFilterState);

// State filter sementara (diganti-ganti saat drawer filter terbuka)
const [tempFilter, setTempFilter] = useState(initialFilterState);

// State untuk daftar label (badge) filter yang aktif
const [filterLabels, setFilterLabels] = useState<string[]>([]);
```

## 3. Integrasi dengan API
Pass state `filter` (bukan `tempFilter`) ke fungsi hook API sehingga data di-*fetch* berdasarkan state yang sudah diterapkan (di-apply).

```tsx
const { data, isLoading } = useCourseIndex({
    search: debouncedSearch,
    page: currentPage,
    paginate: itemsPerPage,
    filter // Pastikan endpoint menerima objek filter
});
```

Dan reset kembali halaman ke `1` (satu) apabila filter berubah:

```tsx
useEffect(() => {
    setCurrentPage(1);
}, [debouncedSearch, itemsPerPage, filter]);
```

## 4. Handler untuk Membersihkan dan Menerapkan Filter
Buat fungsi `handleClearFilter` dan `handleApplyFilter`.

```tsx
const handleClearFilter = () => {
    setFilter(initialFilterState);
    setTempFilter(initialFilterState);
};

const handleApplyFilter = () => {
    setFilter(tempFilter);
};
```

## 5. Konten UI Filter (Drawer)
Gunakan `useMemo` untuk membangun komponen UI filter. **Penting:** Semua input (Select, Input, SearchableSelect) harus di-bind ke `tempFilter`, BUKAN ke `filter`.

```tsx
const filterContent = useMemo(() => (
    <div className="flex flex-col gap-4">
        <div>
            <LabelComp>Kategori</LabelComp>
            <SearchableSelect
                options={categoryOptions}
                value={tempFilter.course_category_id || ''}
                onChange={(val) => {
                    const valStr = val as string;
                    let categoryData = undefined;
                    if (valStr) {
                        const selectedOpt = categoryOptions.find(opt => opt.value === valStr);
                        if (selectedOpt && selectedOpt.data) {
                            categoryData = selectedOpt.data;
                        }
                    }
                    setTempFilter(prev => ({ 
                        ...prev, 
                        course_category_id: valStr || undefined, 
                        course_category_data: categoryData 
                    }));
                }}
                // ...
            />
        </div>
        
        {/* Contoh Input Biasa */}
        <div>
            <LabelComp>Status</LabelComp>
            <Select 
                value={tempFilter.status || 'none'} 
                onValueChange={(val) => setTempFilter(prev => ({ ...prev, status: val }))}
            >
                {/* ... */}
            </Select>
        </div>
    </div>
), [categoryOptions, tempFilter, categorySearch, isLoadingCategory]);
```

## 6. Mendaftarkan Konfigurasi ke Topbar
Kirimkan `filterContent`, `handleClearFilter`, dan `handleApplyFilter` ke hook `useTopbarActions`. Hal ini akan membuat Topbar secara otomatis mengeksekusi fungsi Anda saat tombol di drawer ditekan.

```tsx
const topbarConfig = useMemo(() => ({
    search: {
        placeholder: 'Cari data...',
        value: search,
        onChange: setSearch,
    },
    filter: {
        content: filterContent,
        onClear: handleClearFilter,
        onApply: handleApplyFilter, // Triggered saat klik "Terapkan"
    },
}), [search, filterContent]);

useTopbarActions(topbarConfig);
```

## 7. Menghasilkan Label secara Dinamis (`useEffect`)
Buat sebuah `useEffect` yang hanya memantau perubahan pada `filter` (state aktif). Di dalamnya, bangun teks label berdasarkan nilai filter.

```tsx
useEffect(() => {
    const labels: string[] = [];

    // Gunakan data nama alih-alih ID mentah
    if (filter.course_category_data?.name) {
        labels.push(`Category: ${filter.course_category_data.name}`);
    }

    if (filter.level && filter.level !== 'none') {
        labels.push(`Level: ${filter.level.replace('_', ' ')}`);
    }

    if (filter.status && filter.status !== 'none') {
        labels.push(`Status: ${filter.status}`);
    }

    if (filter.min_price || filter.max_price) {
        let priceLabel = 'Harga: ';
        if (filter.min_price && filter.max_price) {
            priceLabel += `${formatNumber(Number(filter.min_price))} - ${formatNumber(Number(filter.max_price))}`;
        } else if (filter.min_price) {
            priceLabel += `> ${formatNumber(Number(filter.min_price))}`;
        } else if (filter.max_price) {
            priceLabel += `< ${formatNumber(Number(filter.max_price))}`;
        }
        labels.push(priceLabel);
    }

    setFilterLabels(labels);
}, [filter]);
```

## 8. Mengirimkan Label ke Data Page Template
Terakhir, oper `filterLabels` ke komponen `DataPageTemplate`.

```tsx
return (
    <DataPageTemplate
        title="Daftar Data"
        filterLabels={filterLabels} // <- Dioper ke DataPageTemplate
        description="Deskripsi data."
        // ...
    />
);
```
