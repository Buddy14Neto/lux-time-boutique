
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      name: 'Produtos',
      path: '/admin/produtos',
      icon: <Package className="h-5 w-5" />
    },
    {
      name: 'Pedidos',
      path: '/admin/pedidos',
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      name: 'Usuários',
      path: '/admin/usuarios',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Configurações',
      path: '/admin/configuracoes',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente."
      });
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-md">
      <div className="p-4 border-b border-border">
        <Link to="/">
          <h2 className="text-2xl font-bold text-primary">
            <span className="text-foreground">Lux</span>
            <span className="text-gold-dark dark:text-gold-DEFAULT">Time</span>
            <span className="ml-2 text-sm font-normal text-muted-foreground">Admin</span>
          </h2>
        </Link>
      </div>
      
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive(item.path) && (item.exact ? location.pathname === item.path : true)
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-accent/50'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <Button
            variant="ghost"
            className="flex w-full items-center px-4 py-2 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sair</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
