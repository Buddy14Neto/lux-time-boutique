
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Loader } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário não estiver carregando e não estiver autenticado, redireciona para o login
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Se o usuário estiver autenticado, mas não for admin, redireciona para o dashboard normal
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  // Mostra carregando apenas durante a verificação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-gold-DEFAULT mb-2" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado ou não for admin, não renderiza nada
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8 pt-16 ml-64">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
