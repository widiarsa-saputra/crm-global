import React, { useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadFile } from '@/services/file'
import { useQueryClient } from '@tanstack/react-query'

interface UploadImageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUploadComplete?: (files: File[]) => void
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ 
    open, 
    onOpenChange,
    onUploadComplete 
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const uploadFileMutation = useUploadFile()
    const queryClient = useQueryClient()

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const imageFiles = Array.from(files).filter(file => 
                file.type.startsWith('image/')
            )
            
            if (imageFiles.length !== files.length) {
                toast.warning('Only image files are allowed')
            }
            
            setSelectedFiles((prev) => [...prev, ...imageFiles])
        }
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files) {
            const imageFiles = Array.from(files).filter(file => 
                file.type.startsWith('image/')
            )
            
            if (imageFiles.length !== files.length) {
                toast.warning('Only image files are allowed')
            }
            
            setSelectedFiles((prev) => [...prev, ...imageFiles])
        }
    }, [])

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one image')
            return
        }

        try {
            // Upload all files
            const uploadPromises = selectedFiles.map((file) =>
                uploadFileMutation.mutateAsync({
                    file: file
                })
            )

            await Promise.all(uploadPromises)

            toast.success(`Successfully uploaded ${selectedFiles.length} image(s)`)
            
            // Invalidate file list to refresh
            queryClient.invalidateQueries({ queryKey: ['file-list'] })
            
            if (onUploadComplete) {
                onUploadComplete(selectedFiles)
            }
            
            setSelectedFiles([])
            onOpenChange(false)
        } catch (error) {
            toast.error('Failed to upload images')
            console.error(error)
        }
    }

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={() => onOpenChange(false)}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded shadow-2xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 pb-4 border-b">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
                                <p className="text-gray-500 text-sm mt-1">Drag and drop images here or click to browse</p>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="h-8 w-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                    {/* Drag and Drop Area */}
                    <div
                        className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
                            isDragging
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                            Drag & drop images here, or click to select files
                        </p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload">
                            <Button type="button" variant="outline" asChild>
                                <span className="cursor-pointer">Browse Images</span>
                            </Button>
                        </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <p className="text-sm font-medium">
                                Selected Images ({selectedFiles.length})
                            </p>
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                                >
                                    <ImageIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 flex-shrink-0"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4 px-6 flex justify-end gap-2 bg-gradient-to-r from-gray-50 to-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSelectedFiles([])
                                onOpenChange(false)
                            }}
                            disabled={uploadFileMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploadFileMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {uploadFileMutation.isPending ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadImageModal
