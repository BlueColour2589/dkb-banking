// lib/auth.ts
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from './api';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);
}
