import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EditorContent {
    html: string;
}

interface CustomEditorProps {
    value: EditorContent | null | undefined;
    onChange: (value: EditorContent) => void;
}

interface ActiveFormats {
    bold: boolean;
    italic: boolean;
    strikeThrough: boolean;
    h1: boolean;
    h2: boolean;
    bulletList: boolean;
    orderedList: boolean;
    blockquote: boolean;
}

const DEFAULT_FORMATS: ActiveFormats = {
    bold: false,
    italic: false,
    strikeThrough: false,
    h1: false,
    h2: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
};

interface ToolbarButtonProps {
    onMouseDown: (e: React.MouseEvent) => void;
    isActive: boolean;
    title: string;
    children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onMouseDown, isActive, title, children }) => (
    <button
        type="button"
        title={title}
        onMouseDown={onMouseDown}
        className={cn(
            'inline-flex items-center justify-center rounded-md p-1.5 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
        )}
    >
        {children}
    </button>
);

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [formats, setFormats] = useState<ActiveFormats>(DEFAULT_FORMATS);
    const isInitialized = useRef(false);

    // Initialize content on mount only
    useEffect(() => {
        if (editorRef.current && !isInitialized.current) {
            editorRef.current.innerHTML = value?.html ?? '';
            isInitialized.current = true;
        }
    }, []);

    // Sync when value changes externally (e.g., form.reset())
    useEffect(() => {
        if (editorRef.current && isInitialized.current) {
            const newHtml = value?.html ?? '';
            if (editorRef.current.innerHTML !== newHtml) {
                editorRef.current.innerHTML = newHtml;
            }
        }
    }, [value]);

    const detectFormats = useCallback(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editorRef.current) {
            return;
        }

        const range = selection.getRangeAt(0);
        if (!editorRef.current.contains(range.commonAncestorContainer)) return;

        let node: Node | null = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        const el = node as Element | null;

        setFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            h1: !!el?.closest('h1'),
            h2: !!el?.closest('h2'),
            bulletList: !!el?.closest('ul'),
            orderedList: !!el?.closest('ol'),
            blockquote: !!el?.closest('blockquote'),
        });
    }, []);

    const notifyChange = useCallback(() => {
        if (editorRef.current) {
            onChange({ html: editorRef.current.innerHTML });
        }
        detectFormats();
    }, [onChange, detectFormats]);

    // Inline formatting: bold, italic, strikeThrough
    const execInline = useCallback((command: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false);
        notifyChange();
    }, [notifyChange]);

    // Block formatting (heading, blockquote): toggles between tag and <p>
    const toggleBlock = useCallback((tag: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        const el = node as Element | null;

        editorRef.current?.focus();
        const isActive = !!el?.closest(tag);
        document.execCommand('formatBlock', false, isActive ? 'p' : tag);
        notifyChange();
    }, [notifyChange]);

    // List formatting: toggles list on/off
    const execList = useCallback((command: 'insertUnorderedList' | 'insertOrderedList') => {
        editorRef.current?.focus();
        document.execCommand(command, false);
        notifyChange();
    }, [notifyChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const ctrl = e.ctrlKey || e.metaKey;
        if (!ctrl) return;

        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                execInline('bold');
                break;
            case 'i':
                e.preventDefault();
                execInline('italic');
                break;
            case 'z':
                e.preventDefault();
                execInline(e.shiftKey ? 'redo' : 'undo');
                break;
            case 'y':
                e.preventDefault();
                execInline('redo');
                break;
            case 's':
                if (e.shiftKey) {
                    e.preventDefault();
                    execInline('strikeThrough');
                }
                break;
        }
    }, [execInline]);

    return (
        <div className="border rounded-md overflow-hidden bg-background">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); execInline('bold'); }}
                    isActive={formats.bold}
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); execInline('italic'); }}
                    isActive={formats.italic}
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); execInline('strikeThrough'); }}
                    isActive={formats.strikeThrough}
                    title="Strikethrough (Ctrl+Shift+S)"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-border mx-1 self-center" />

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); toggleBlock('h1'); }}
                    isActive={formats.h1}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); toggleBlock('h2'); }}
                    isActive={formats.h2}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-border mx-1 self-center" />

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); execList('insertUnorderedList'); }}
                    isActive={formats.bulletList}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); execList('insertOrderedList'); }}
                    isActive={formats.orderedList}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onMouseDown={(e) => { e.preventDefault(); toggleBlock('blockquote'); }}
                    isActive={formats.blockquote}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={notifyChange}
                onKeyDown={handleKeyDown}
                onKeyUp={detectFormats}
                onMouseUp={detectFormats}
                onSelect={detectFormats}
                className={cn(
                    'prose prose-sm sm:prose-base dark:prose-invert',
                    'focus:outline-none min-h-[300px] p-4 max-w-none'
                )}
            />
        </div>
    );
};

export { CustomEditor };
export default CustomEditor;
