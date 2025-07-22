"use client";
import { useAuth } from '@/contexts/AuthContext';

export function useUser() {
  const { user, isReady } = useAuth();
  
  return {
    data: user,
    loading: !isReady,
    error: null
  };
}
