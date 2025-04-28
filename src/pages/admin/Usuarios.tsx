
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search, Loader, ArrowUp, ArrowDown, ShieldCheck, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/components/auth/AuthProvider';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string | null;
  is_admin: boolean | null;
  updated_at: string | null;
}

export default function AdminUsuarios() {
  const { user, promoteToAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortDir]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order(sortBy, { ascending: sortDir === 'asc' });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const handlePromoteClick = (id: string) => {
    setPromotingId(id);
    setIsPromoteDialogOpen(true);
  };

  const handlePromoteConfirm = async () => {
    if (!promotingId) return;

    setIsPromoting(true);
    try {
      // Utiliza a função promoteToAdmin do AuthProvider
      const success = await promoteToAdmin(promotingId);
      
      if (success) {
        // Atualiza a lista de usuários localmente
        setUsers(users.map(user => 
          user.id === promotingId ? { ...user, is_admin: true, role: 'admin' } : user
        ));
        
        toast({
          title: 'Usuário promovido',
          description: 'O usuário foi promovido a administrador com sucesso.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível promover o usuário a administrador.'
      });
    } finally {
      setIsPromoting(false);
      setIsPromoteDialogOpen(false);
      setPromotingId(null);
    }
  };

  const handlePromoteCancel = () => {
    setIsPromoteDialogOpen(false);
    setPromotingId(null);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.role || '').toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return sortDir === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <AdminLayout title="Gerenciar Usuários">
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários por nome, email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nome <SortIcon column="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email <SortIcon column="email" />
                </div>
              </TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead 
                className="cursor-pointer hidden md:table-cell" 
                onClick={() => handleSort('updated_at')}
              >
                <div className="flex items-center">
                  Atualizado <SortIcon column="updated_at" />
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader className="h-5 w-5 animate-spin text-gold-DEFAULT" />
                    <span>Carregando usuários...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? 'Nenhum usuário corresponde à sua pesquisa.' : 'Nenhum usuário encontrado.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name || 'User'}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-sm">
                          {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {profile.name || 'Sem nome'}
                    {profile.id === user?.id && (
                      <span className="text-xs ml-2 text-muted-foreground">(Você)</span>
                    )}
                  </TableCell>
                  <TableCell>{profile.email || 'Sem email'}</TableCell>
                  <TableCell>
                    {profile.is_admin ? (
                      <Badge variant="default">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Administrador
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        Usuário
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(profile.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {!profile.is_admin && profile.id !== user?.id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePromoteClick(profile.id)}
                        className="text-xs"
                      >
                        Promover a Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promover a Administrador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja promover este usuário a administrador? 
              Administradores têm acesso completo ao painel administrativo e podem gerenciar todos os aspectos do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handlePromoteCancel} disabled={isPromoting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePromoteConfirm}
              disabled={isPromoting}
              className="bg-gold-DEFAULT hover:bg-gold-dark"
            >
              {isPromoting ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Promovendo...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Sim, promover a administrador
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
