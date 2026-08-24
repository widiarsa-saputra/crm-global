import React from 'react'
import { Check } from 'lucide-react'
import { MediaFile } from './MediaLibraryModal'

interface ImageSelectionCardProps {
    file: MediaFile
    isSelected: boolean
    onClick: () => void
}

const ImageSelectionCard: React.FC<ImageSelectionCardProps> = ({
    file,
    isSelected,
    onClick
}) => {
    return (
        <div
            className={`relative bg-white rounded border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            onClick={onClick}
        >
            {/* Image Preview */}
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ddd" width="200" height="150"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="75" dx="50"%3ENo Preview%3C/text%3E%3C/svg%3E'
                    }}
                />
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded p-1">
                    <Check className="h-4 w-4 text-white" />
                </div>
            )}

            {/* File Info */}
            <div className="p-3 bg-white">
                <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{file.size_for_human || `${(file.size / 1024).toFixed(2)} KB`}</p>
            </div>
        </div>
    )
}

export default ImageSelectionCard
