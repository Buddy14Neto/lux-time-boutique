
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Search, Loader, PenLine, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
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
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount_price: number | null;
  short_description: string;
  images: string[];
  reference: string;
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
  created_at: string;
}

export default function AdminProdutos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, sortDir]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order(sortBy, { ascending: sortDir === 'asc' });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os produtos'
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

  const handleEditProduct = (id: string) => {
    navigate(`/admin/produtos/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setDeletingProduct(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteId);

      if (error) {
        throw error;
      }

      setProducts(products.filter(product => product.id !== deleteId));
      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o produto.'
      });
    } finally {
      setDeletingProduct(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.reference.toLowerCase().includes(searchLower) ||
      product.short_description.toLowerCase().includes(searchLower)
    );
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return sortDir === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos por nome, marca..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/admin/produtos/novo')} className="ml-4 bg-gold-DEFAULT hover:bg-gold-dark">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Imagem</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Produto <SortIcon column="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('brand')}
              >
                <div className="flex items-center">
                  Marca <SortIcon column="brand" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Referência
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right" 
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end">
                  Preço <SortIcon column="price" />
                </div>
              </TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader className="h-5 w-5 animate-spin text-gold-DEFAULT" />
                    <span>Carregando produtos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? 'Nenhum produto corresponde à sua pesquisa.' : 'Nenhum produto encontrado.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="h-14 w-14 object-cover rounded"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-muted rounded flex items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium truncate max-w-[200px]">{product.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.short_description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.reference}</TableCell>
                  <TableCell className="text-right">
                    {product.discount_price ? (
                      <div>
                        <span className="text-muted-foreground line-through text-xs">
                          {formatPrice(product.price)}
                        </span>
                        <div className="font-medium text-destructive">
                          {formatPrice(product.discount_price)}
                        </div>
                      </div>
                    ) : (
                      <div className="font-medium">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.featured && <Badge variant="default" className="bg-gold-DEFAULT hover:bg-gold-dark">Destaque</Badge>}
                      {product.bestseller && <Badge variant="outline" className="border-gold-DEFAULT text-gold-DEFAULT">Mais Vendido</Badge>}
                      {product.new_arrival && <Badge variant="secondary">Novidade</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product.id)}>
                        <PenLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7} className="text-right">
                Total: {filteredProducts.length} produtos
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será permanentemente excluído do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={deletingProduct}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deletingProduct}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingProduct ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Sim, excluir produto'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
