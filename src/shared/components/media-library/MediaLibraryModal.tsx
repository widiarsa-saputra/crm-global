import React, { useState, useEffect } from 'react'
import { X, Search, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageSelectionCard from './ImageSelectionCard'
import UploadImageModal from './UploadImageModal'
import useIndexFile from '@/services/file'

export interface MediaFile {
    id: string
    name: string
    size: number
    size_for_human?: string
    url: string
    ext: string
    mime_type: string
    created_at: string
    updated_at: string
}

interface MediaLibraryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (file: MediaFile | MediaFile[]) => void
    multiple?: boolean
    title?: string
    subtitle?: string
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
    open,
    onOpenChange,
    onSelect,
    multiple = false,
    title = "Media Library",
    subtitle = "Select or upload images"
}) => {
    const [search, setSearch] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

    // Fetch files from API
    const { data: filesData, isLoading } = useIndexFile({
        params: {
            search: search,
            paginate: 50,
            'filter[is_trashed]': 'false'
        }
    })

    const displayFiles = filesData?.data || []

    const handleFileClick = (fileId: string) => {
        if (multiple) {
            setSelectedFiles(prev => {
                if (prev.includes(fileId)) {
                    return prev.filter(id => id !== fileId)
                } else {
                    return [...prev, fileId]
                }
            })
        } else {
            setSelectedFiles([fileId])
            // Immediately select for single selection
            const selectedFile = displayFiles.find((f: MediaFile) => f.id === fileId)
            if (selectedFile) {
                onSelect(selectedFile)
                onOpenChange(false)
                setSelectedFiles([])
                setSearch("")
            }
        }
    }

    const handleConfirmSelection = () => {
        if (multiple) {
            const selected = displayFiles.filter((f: MediaFile) => selectedFiles.includes(f.id))
            onSelect(selected)
        }
        onOpenChange(false)
        setSelectedFiles([])
        setSearch("")
    }

    const handleClose = () => {
        onOpenChange(false)
        setSelectedFiles([])
        setSearch("")
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
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 pb-4 border-b">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                                <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="h-8 w-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Search and Upload Bar */}
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search images..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    {isLoading ? 'Loading...' : `${displayFiles.length} images`}
                                </span>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                    onClick={() => setIsUploadModalOpen(true)}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Image
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Images Grid */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-500">Loading images...</span>
                            </div>
                        ) : displayFiles.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No images found
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {displayFiles.map((file: MediaFile) => (
                                    <ImageSelectionCard
                                        key={file.id}
                                        file={file}
                                        isSelected={selectedFiles.includes(file.id)}
                                        onClick={() => handleFileClick(file.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4 px-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
                        <p className="text-sm text-gray-600">
                            Click on an image to select it
                        </p>
                        <div className="flex items-center gap-2">
                            {multiple && selectedFiles.length > 0 && (
                                <Button
                                    onClick={handleConfirmSelection}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Select {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                                </Button>
                            )}
                            <Button variant="outline" onClick={handleClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <UploadImageModal
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
            />
        </>
    )
}

export default MediaLibraryModal
