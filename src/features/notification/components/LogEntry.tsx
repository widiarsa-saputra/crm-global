// src/components/LogEntry.tsx
import { LogItem } from "../types";

interface LogEntryProps {
    log: LogItem;
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
    const time = new Date(log.timestamp);
    const formattedTime = time.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' });

    return (
        <div className="border-b border-gray-200 pb-3 mb-3 last:border-b-0 last:mb-0">
            <p className="mb-1 text-xs">
                <span className="text-gray-500">{formattedTime}</span> -
                ID: <span className="font-mono text-purple-500">{log.id || 'N/A'}</span> -
                Event: <span className="font-semibold text-blue-500">{log.type}</span> -
                Room: <span className="font-semibold text-teal-500">{log.room_id}</span>
                {log.isHistory && (
                    <span className="ml-2 bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded text-[0.6rem] font-bold align-middle">
                        HISTORI
                    </span>
                )}
            </p>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-x-auto text-xs font-mono border border-gray-700">
                {JSON.stringify(log.payload, null, 2)}
            </pre>
        </div>
    );
};

export default LogEntry;