import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import MediaLibraryModal, { MediaFile } from '@/shared/components/media-library/MediaLibraryModal'

// Example usage component
const MediaLibraryExample: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null)

    const handleSelect = (file: MediaFile | MediaFile[]) => {
        if (Array.isArray(file)) {
            console.log('Multiple files selected:', file)
        } else {
            setSelectedImage(file)
            console.log('Single file selected:', file)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Media Library Component Example</h1>
            
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Single Selection</h2>
                    <Button onClick={() => setIsOpen(true)}>
                        Open Media Library
                    </Button>
                    
                    {selectedImage && (
                        <div className="mt-4 p-4 border rounded">
                            <p className="text-sm font-medium mb-2">Selected Image:</p>
                            <img 
                                src={selectedImage.url} 
                                alt={selectedImage.name}
                                className="w-40 h-40 object-cover rounded"
                            />
                            <p className="text-sm mt-2">{selectedImage.name}</p>
                            <p className="text-xs text-gray-500">{selectedImage.size}</p>
                        </div>
                    )}
                </div>
            </div>

            <MediaLibraryModal
                open={isOpen}
                onOpenChange={setIsOpen}
                onSelect={handleSelect}
                multiple={false}
            />
        </div>
    )
}

export default MediaLibraryExample
