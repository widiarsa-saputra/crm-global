// src/components/LogPanel.tsx
import { useRef, useEffect } from 'react';
import { LogItem } from "../types";
import LogEntry from "./LogEntry";

interface LogPanelProps {
    logEntries: LogItem[];
    onClearLog: () => void;
}

const LogPanel: React.FC<LogPanelProps> = ({ logEntries, onClearLog }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Efek untuk scroll ke atas setiap kali ada log baru
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = 0;
        }
    }, [logEntries]);

    return (
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Log Data Diterima:</h2>
                <button onClick={onClearLog} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition duration-150 text-xs">
                    Bersihkan Log
                </button>
            </div>
            <div ref={logContainerRef} className="h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
                {logEntries.length === 0 ? (
                    <p className="text-gray-500 italic text-center p-4">Menunggu data...</p>
                ) : (
                    logEntries.map((log) => <LogEntry key={log.id} log={log} />)
                )}
            </div>
        </div>
    );
};

export default LogPanel;