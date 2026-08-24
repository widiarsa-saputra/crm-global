// src/components/FacebookStyleChat/ChatTrigger.tsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatTriggerProps {
    onClick: () => void;
}

const ChatTrigger: React.FC<ChatTriggerProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-[5%] right-4 sm:right-6 bg-blue-600 text-white rounded p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all z-50 pointer-events-auto"
            aria-label="Buka daftar chat"
        >
            <MessageSquare size={24} />
        </button>
    );
};

export default ChatTrigger;