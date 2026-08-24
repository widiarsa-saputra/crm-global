import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // This is default, but let's be explicit
            retry: 1,
        },
    },
});
