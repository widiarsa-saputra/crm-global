import React, { useState, useEffect } from 'react'
import { Search, Star, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
    isCollapsed: boolean
}

const SearchBar: React.FC<Props> = ({ isCollapsed }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [favoriteSearches, setFavoriteSearches] = useState<string[]>(() => {
        // Load favorite searches from localStorage
        const savedFavorites = localStorage.getItem('favoriteSearches')
        return savedFavorites ? JSON.parse(savedFavorites) : []
    })

    useEffect(() => {
        // Simulate recent searches loading
        const recent = ['Tailwind CSS', 'React', 'JavaScript']
        setRecentSearches(recent)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleModal(); // Buka modal ketika Command + K ditekan
            }
        };

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    const handleRemoveRecentSearch = (search: string) => {
        setRecentSearches((prev) => prev.filter((item) => item !== search))
    }

    const handleAddToFavorites = (search: string) => {
        // Add to favorite searches and store in localStorage
        if (!favoriteSearches.includes(search)) {
            const updatedFavorites = [...favoriteSearches, search]
            setFavoriteSearches(updatedFavorites)
            localStorage.setItem('favoriteSearches', JSON.stringify(updatedFavorites))
        }
    }

    const handleRemoveFavorite = (search: string) => {
        const updatedFavorites = favoriteSearches.filter((item) => item !== search)
        setFavoriteSearches(updatedFavorites)
        localStorage.setItem('favoriteSearches', JSON.stringify(updatedFavorites))
    }

    const isFavorite = (search: string) => favoriteSearches.includes(search)

    return (
        <div className="p-4">
            {/* Tombol Search yang hanya tampil ketika collapsed */}
            {isCollapsed ? (
                <div className="flex justify-center items-center h-full">
                    <button
                        onClick={toggleModal}
                        className="p-2 rounded bg-gray-200 text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 w-full rounded bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClick={toggleModal}
                    />
                    <div className="absolute right-3 top-2.5 flex gap-1">
                        <span className="text-xs text-gray-400">⌘</span>
                        <span className="text-xs text-gray-400">K</span>
                    </div>
                </div>
            )}

            {/* Modal Search ketika ikon pencarian diklik */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={toggleModal}>
                    {/* Elemen latar belakang dengan opacity */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>

                    {/* Konten modal */}
                    <div className="bg-white p-4 rounded w-96 relative">
                        {/* Search input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search"
                                className="pl-10 h-12 bg-gray-50 border border-gray-200 w-full"
                            />

                            {/* ESC icon shortcut style */}
                            <div className="absolute right-3 top-2.5">
                                <span className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5">
                                    esc
                                </span>
                            </div>
                        </div>

                        {/* Recent Searches */}
                        {!searchQuery && (
                            <div className="mt-4">
                                <h3 className="text-sm text-gray-600 font-semibold">Recent Searches</h3>
                                <ul className="mt-2 space-y-2">
                                    {recentSearches.map((search, index) => (
                                        <li key={index} className="flex items-center justify-between">
                                            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                                {search}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAddToFavorites(search)}
                                                    className={`text-sm ${isFavorite(search) ? 'text-yellow-400' : 'text-gray-400'} hover:text-gray-600`}
                                                >
                                                    <Star className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveRecentSearch(search)}
                                                    className="text-sm text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Favorite Searches */}
                        {favoriteSearches.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm text-gray-600 font-semibold">Favorite Searches</h3>
                                <ul className="mt-2 space-y-2">
                                    {favoriteSearches.map((search, index) => (
                                        <li key={index} className="flex items-center justify-between">
                                            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                                {search}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveFavorite(search)}
                                                className="text-sm text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Hasil Pencarian */}
                        {searchQuery && (
                            <div className="mt-4">
                                <h3 className="text-sm text-gray-600 font-semibold">Search Results</h3>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <h4 className="text-gray-700">Post</h4>
                                        <p className="text-gray-500">{`Learn ${searchQuery}`}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-700">Blog</h4>
                                        <p className="text-gray-500">{`Intro to ${searchQuery}`}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar