import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5)
      gcTime: 30 * 60 * 1000, // 30 minutes (increased from 10)
      refetchOnWindowFocus: true, // Changed to true to refresh when user returns to app
      refetchOnMount: 'always', // Refetch when component mounts to ensure freshness
      refetchOnReconnect: true, // Refetch on network reconnection
    },
  },
});

// Create a persister for the query client using AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'sonora-query-cache-v1',
  throttleTime: 1000, // Don't spam AsyncStorage
  serialize: (data: unknown) => JSON.stringify(data),
  deserialize: (data: string) => JSON.parse(data),
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}