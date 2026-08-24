import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, File } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadFile } from '@/services/file'

interface UploadFileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({ open, onOpenChange }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const uploadMutation = useUploadFile()

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const newFiles = Array.from(files)
            setSelectedFiles((prev) => [...prev, ...newFiles])
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
            const newFiles = Array.from(files)
            setSelectedFiles((prev) => [...prev, ...newFiles])
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
            toast.error('Please select at least one file')
            return
        }

        try {
            // Upload all files in parallel
            const uploadPromises = selectedFiles.map((file) =>
                uploadMutation.mutateAsync({
                    file: file,
                    title: file.name,
                })
            )

            await Promise.all(uploadPromises)

            toast.success(`Successfully uploaded ${selectedFiles.length} file(s)`)
            setSelectedFiles([])
            onOpenChange(false)
        } catch (error) {
            toast.error('Failed to upload files')
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Drag and drop files here or click to browse
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Drag and Drop Area */}
                    <div
                        className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
                            isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                            Drag & drop files here, or click to select files
                        </p>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <Button type="button" variant="outline" asChild>
                                <span className="cursor-pointer">Browse Files</span>
                            </Button>
                        </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <p className="text-sm font-medium">
                                Selected Files ({selectedFiles.length})
                            </p>
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                                >
                                    <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
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

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSelectedFiles([])
                                onOpenChange(false)
                            }}
                            disabled={uploadMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploadMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UploadFileModal
