
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search, ArrowUp, ArrowDown, UserCog, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  is_admin: boolean | null;
  updated_at: string | null;
}

export default function AdminUsuarios() {
  const { user: currentUser, promoteToAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortDirection]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('*');

      // Adicionar ordenação
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setUsers(data as UserProfile[]);
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      setProcessingUser(userId);
      
      const success = await promoteToAdmin(userId);
      
      if (success) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, is_admin: true, role: 'admin' } : user
        ));
      }
    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível promover o usuário.'
      });
    } finally {
      setProcessingUser(null);
    }
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
      year: 'numeric'
    });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <AdminLayout title="Gerenciar Usuários">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários por nome, email, função..."
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
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Função <SortIcon column="role" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('updated_at')}
              >
                <div className="flex items-center">
                  Última Atualização <SortIcon column="updated_at" />
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || 'Nome não definido'}</TableCell>
                  <TableCell>{user.email || 'Email não definido'}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge variant="success" className="flex items-center w-fit gap-1">
                        <Shield className="h-3 w-3" />
                        Administrador
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center w-fit gap-1">
                        <UserCog className="h-3 w-3" />
                        Usuário
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    {!user.is_admin && user.id !== currentUser?.id && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePromoteToAdmin(user.id)}
                        disabled={processingUser === user.id}
                        className="text-gold-dark hover:text-gold-DEFAULT hover:bg-gold-DEFAULT/10"
                      >
                        {processingUser === user.id ? (
                          <>Processando...</>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-1" />
                            Promover a Admin
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right">
                Total: {filteredUsers.length} usuários
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </AdminLayout>
  );
}
