import { useState } from 'react';
import { toast } from 'sonner';

interface ErrorToastProps {
    toastId: string | number;
    title: string;
    details: string;
}

export const ErrorToast = ({ toastId, title, details }: ErrorToastProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(details);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset afrter 2 seconds
    };

    return (
        <div className="flex items-start justify-between w-full p-4 bg-red-50 border border-red-200 rounded shadow-lg">
            <div className="flex-1">
                <p className="font-semibold text-red-800">{title}</p>
                <p className="text-xs text-gray-600 mt-1">An unexpected error occurred. Please contact support if this issue persists.</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                <button
                    onClick={handleCopy}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2.5 rounded-md transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy Details'}
                </button>
                <button
                    onClick={() => toast.dismiss(toastId)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Dismiss"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};