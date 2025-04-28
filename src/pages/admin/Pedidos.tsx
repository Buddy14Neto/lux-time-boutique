
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { 
  Search, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  CheckCircle,
  Clock,
  Truck,
  PackageX,
  Ban 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  created_at: string;
  payment_method: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  user_email?: string;
  user_name?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price: number;
  total: number;
  product_name?: string;
  product_brand?: string;
}

interface OrderWithUserDetails extends Order {
  profiles: {
    name: string;
    email: string;
  };
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [sortBy, sortDirection]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (error) {
        throw error;
      }

      // Transform data to include user details
      const ordersWithUserDetails: Order[] = (data as OrderWithUserDetails[]).map(order => ({
        ...order,
        user_name: order.profiles?.name || 'Usuário Desconhecido',
        user_email: order.profiles?.email || 'email@desconhecido.com'
      }));

      setOrders(ordersWithUserDetails);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os pedidos.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      // Fetch order items with product details
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (
            name,
            brand
          )
        `)
        .eq('order_id', order.id);

      if (error) {
        throw error;
      }

      // Transform data to include product details
      const itemsWithProductDetails = orderItems.map((item: any) => ({
        ...item,
        product_name: item.products?.name || 'Produto Indisponível',
        product_brand: item.products?.brand || ''
      }));

      setSelectedOrder({
        ...order,
        items: itemsWithProductDetails
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes do pedido.'
      });
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

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', selectedOrder.id);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, status } : order
      ));
      
      setSelectedOrder({
        ...selectedOrder,
        status
      });
      
      toast({
        title: 'Status atualizado',
        description: `Pedido atualizado para ${getStatusLabel(status)}.`
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o status do pedido.'
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.user_name?.toLowerCase().includes(searchLower) ||
      order.user_email?.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      formatDate(order.created_at).includes(searchLower)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <PackageX className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <Ban className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Em processamento';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <AdminLayout title="Gerenciar Pedidos">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pedidos por ID, cliente, status..."
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
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Pedido <SortIcon column="id" />
                </div>
              </TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  Data <SortIcon column="created_at" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status <SortIcon column="status" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('total')}
                className="text-right"
              >
                <div className="flex items-center justify-end">
                  Total <SortIcon column="total" />
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Carregando pedidos...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user_name}</div>
                      <div className="text-xs text-muted-foreground">{order.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status) as any} className="flex items-center w-fit gap-1">
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right">
                Total: {filteredOrders.length} pedidos
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Dialog para detalhes do pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.id.substring(0, 8)}</DialogTitle>
            <DialogDescription>
              Realizado em {selectedOrder && formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status e atualização */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status Atual</h3>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status) as any} className="flex items-center gap-1">
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    disabled={updatingStatus}
                    defaultValue={selectedOrder.status}
                    onValueChange={handleUpdateStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Alterar Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processing">Em processamento</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Informações do cliente */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nome</p>
                    <p>{selectedOrder.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedOrder.user_email}</p>
                  </div>
                </div>
              </div>

              {/* Endereço de entrega */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Endereço de Entrega</h3>
                <p>{selectedOrder.address_street}</p>
                <p>{selectedOrder.address_city}, {selectedOrder.address_state}, {selectedOrder.address_zip}</p>
                <p>{selectedOrder.address_country}</p>
              </div>

              {/* Método de pagamento */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Método de Pagamento</h3>
                <p>{selectedOrder.payment_method}</p>
              </div>

              {/* Itens do pedido */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Itens do Pedido</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">{item.product_brand}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium">{formatPrice(item.total)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            Nenhum item encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Subtotal</TableCell>
                        <TableCell className="text-right">{formatPrice(selectedOrder.subtotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3}>Frete</TableCell>
                        <TableCell className="text-right">{formatPrice(selectedOrder.shipping)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3}>Impostos</TableCell>
                        <TableCell className="text-right">{formatPrice(selectedOrder.tax)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatPrice(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
