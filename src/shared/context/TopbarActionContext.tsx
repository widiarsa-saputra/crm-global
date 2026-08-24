import React, { createContext, useContext, useRef, ReactNode, useSyncExternalStore } from 'react';

export interface TopbarActions {
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    filter?: {
        content: ReactNode;
        onApply?: () => void;
        onClear?: () => void;
    };
    download?: {
        onDownload: () => void;
        label?: string;
    };
    extraActions?: ReactNode;
}

// Store class to manage actions without triggering global re-renders
class TopbarStore {
    private actionSources = new Map<string, TopbarActions>();
    private combinedActions: TopbarActions | null = null;
    private subscribers = new Set<() => void>();

    getSnapshot = () => this.combinedActions;

    subscribe = (onStoreChange: () => void) => {
        this.subscribers.add(onStoreChange);
        return () => this.subscribers.delete(onStoreChange);
    };

    setActions = (id: string, actions: TopbarActions | null) => {
        if (actions === null) {
            this.actionSources.delete(id);
        } else {
            this.actionSources.set(id, actions);
        }

        let newCombined: TopbarActions = {};
        let hasActions = false;

        this.actionSources.forEach((src) => {
            hasActions = true;
            newCombined = { ...newCombined, ...src };
        });

        this.combinedActions = hasActions ? newCombined : null;
        this.notify();
    };

    private notify() {
        this.subscribers.forEach((callback) => callback());
    }
}

const TopbarStoreContext = createContext<TopbarStore | undefined>(undefined);

export const TopbarActionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Create the store once per provider lifecycle
    const storeRef = useRef(new TopbarStore());

    return (
        <TopbarStoreContext.Provider value={storeRef.current}>
            {children}
        </TopbarStoreContext.Provider>
    );
};

export const useTopbarActions = (actions: TopbarActions) => {
    const store = useContext(TopbarStoreContext);
    const idRef = useRef(Math.random().toString(36).substring(2, 11));

    if (!store) {
        throw new Error('useTopbarActions must be used within a TopbarActionProvider');
    }

    // Update actions in the store whenever they change
    // We do this in an effect to avoid updating during render
    React.useEffect(() => {
        store.setActions(idRef.current, actions);
        return () => store.setActions(idRef.current, null);
    }, [store, actions]);
};

export const useTopbarContext = () => {
    const store = useContext(TopbarStoreContext);
    if (!store) {
        throw new Error('useTopbarContext must be used within a TopbarActionProvider');
    }

    // Subscribe to changes in the store
    // This only re-renders the component that calls this hook (e.g., TopBar)
    const actions = useSyncExternalStore(store.subscribe, store.getSnapshot);
    
    return { actions };
};
