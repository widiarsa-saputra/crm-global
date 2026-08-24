import React from "react";
import { useDropzone, Accept, FileRejection } from "react-dropzone";
import { ImageUploadWithPreview } from "./ImageUploadWithPreview"; // Pastikan path ini benar

interface ImageUploadWithDropzoneProps {
    value: File | null; // Dari react-hook-form field.value
    onChange: (file: File | null) => void; // Dari react-hook-form field.onChange
    accept?: Accept; // Opsional: untuk tipe file yang diterima
    maxSize?: number; // Opsional: ukuran file maksimum dalam bytes
    disabled?: boolean; // Opsional: untuk menonaktifkan dropzone
    // Anda bisa menambahkan props lain seperti className, style, dll.
    onFileReject?: (rejections: FileRejection[]) => void; // Callback untuk file yang ditolak
}

const ImageUploadWithDropzone = ({
    value,
    onChange,
    accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }, // Default accept
    maxSize = 5 * 1024 * 1024, // Default 5MB
    disabled = false,
    onFileReject,
}: ImageUploadWithDropzoneProps) => {

    const onDropAccepted = React.useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onChange(acceptedFiles[0]); // Panggil onChange dari props (react-hook-form)
            } else {
                // Ini seharusnya tidak terjadi jika multiple=false dan ada file diterima
                // Namun, sebagai fallback, jika tidak ada file yang diterima
                onChange(null);
            }
        },
        [onChange]
    );

    const onDropRejected = React.useCallback(
        (fileRejections: FileRejection[]) => {
            if (onFileReject) {
                onFileReject(fileRejections);
            } else {
                // Penanganan default jika onFileReject tidak disediakan
                if (fileRejections.length > 0) {
                    const firstRejection = fileRejections[0];
                    let message = `File ${firstRejection.file.name} ditolak.`;
                    if (firstRejection.errors.some(e => e.code === 'file-too-large')) {
                        message += ` Ukuran file melebihi ${maxSize / (1024 * 1024)}MB.`;
                    }
                    if (firstRejection.errors.some(e => e.code === 'file-invalid-type')) {
                        message += ` Tipe file tidak valid.`;
                    }
                    alert(message); // Ganti dengan notifikasi yang lebih baik
                }
            }
            // Penting: Jika file ditolak, pastikan nilai form juga di-clear jika perlu
            // Jika sudah ada value sebelumnya, dan user mencoba upload file yg ditolak,
            // value lama mungkin masih ada. Tergantung UX yg diinginkan.
            // Di sini, kita asumsikan jika ada penolakan, kita mungkin ingin mengosongkan field.
            // Atau biarkan value lama jika itu lebih baik.
            // Untuk RHF, jika terjadi penolakan, dan field sebelumnya ada isinya,
            // biarkan user yg memutuskan untuk menghapus value lama via tombol remove.
            // Atau, bisa juga: onChange(null); jika ingin otomatis clear saat ada penolakan.
        },
        [maxSize, onFileReject /*, onChange (jika ingin clear otomatis)*/]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDropAccepted,
        onDropRejected,
        accept,
        maxSize,
        multiple: false, // Hanya izinkan satu file
        disabled,
    });

    const borderColor = isDragActive
        ? '#2196f3' // biru saat aktif
        : isDragReject
            ? '#ff1744' // merah saat file ditolak
            : disabled
                ? '#e0e0e0' // abu-abu saat disabled
                : '#aaa';    // default

    return (
        <div
            {...getRootProps()}
            style={{
                border: `2px dashed ${borderColor}`,
                padding: 20,
                cursor: disabled ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                backgroundColor: disabled ? '#f9f9f9' : (isDragActive ? '#e3f2fd' : 'transparent'),
                opacity: disabled ? 0.7 : 1,
                transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
            }}
        >
            <input {...getInputProps()} />
            {isDragActive && !isDragReject && <p>Jatuhkan file di sini ...</p>}
            {isDragReject && <p style={{ color: '#ff1744' }}>Beberapa file akan ditolak!</p>}
            {!isDragActive && (
                value ? (
                    <p>Seret gambar lain atau klik untuk mengganti</p>
                ) : (
                    <p>Seret & jatuhkan gambar di sini, atau klik untuk memilih</p>
                )
            )}

            <ImageUploadWithPreview
                value={value} // Gunakan value dari props (react-hook-form)
                onChange={onChange} // Gunakan onChange dari props (RHF) untuk menghapus
                renderPreview={(file, url, onRemoveFromPreview) =>
                    file && url ? ( // Pastikan ada file dan URL
                        <div style={{ marginTop: 15, position: "relative", display: 'inline-block', width: 200, height: 200 }}>
                            <img
                                src={url}
                                alt={file.name || "preview"} // Lebih baik ada alt text
                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover", borderRadius: 8 }}
                            />
                            {!disabled && ( // Tombol hapus juga nonaktif jika dropzone disabled
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Hentikan event agar dropzone tidak aktif
                                        onRemoveFromPreview(); // Ini akan memanggil onChange(null) dari ImageUploadWithPreview
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: 5,
                                        right: 5,
                                        background: "rgba(0,0,0,0.6)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        width: 24,
                                        height: 24,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        lineHeight: '1',
                                        padding: 0,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                    }}
                                    aria-label="Hapus gambar"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ) : null
                }
                disableInput={true} // disable input internal karena kita menggunakan dropzone
                showTrigger={false} // hide trigger button internal karena kita menggunakan dropzone
            />
        </div>
    );
};

export default ImageUploadWithDropzone;