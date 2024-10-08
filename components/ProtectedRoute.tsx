// components/ProtectedRoute.tsx

"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !session) {
      router.push('/'); // Redirect to home page if not authenticated
    }
  }, [user, session, router]);

  if (!user && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return <>{children}</>;
}
