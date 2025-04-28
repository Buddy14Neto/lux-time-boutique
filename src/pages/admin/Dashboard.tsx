
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Produtos
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Pedidos
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Usuários
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Receita
        const { data: orders } = await supabase
          .from('orders')
          .select('total');

        const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total as any), 0) || 0;

        setStats({
          totalProducts: productCount || 0,
          totalOrders: orderCount || 0,
          totalUsers: userCount || 0,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Produtos',
      value: stats.totalProducts,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-green-500/10 text-green-500'
    },
    {
      title: 'Usuários',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-yellow-500/10 text-yellow-500'
    },
    {
      title: 'Receita',
      value: `R$ ${stats.revenue.toFixed(2)}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-gold-DEFAULT/10 text-gold-DEFAULT'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nenhum pedido recente encontrado.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nenhum produto vendido ainda.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
