
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function AdminConfiguracoes() {
  const handleSaveSettings = () => {
    toast({
      title: 'Configurações salvas',
      description: 'As configurações foram atualizadas com sucesso.'
    });
  };

  return (
    <AdminLayout title="Configurações">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Loja</CardTitle>
            <CardDescription>
              Gerencie as configurações gerais da sua loja online.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações da Loja</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Nome da Loja</Label>
                  <Input id="store-name" defaultValue="LuxTime" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Email de Contato</Label>
                  <Input id="store-email" type="email" defaultValue="contato@luxtime.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Telefone</Label>
                  <Input id="store-phone" defaultValue="+55 (11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-address">Endereço</Label>
                  <Input id="store-address" defaultValue="Rua das Flores, 123 - São Paulo, SP" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configurações de Envio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-fee">Taxa de Envio Padrão (R$)</Label>
                  <Input id="shipping-fee" type="number" defaultValue="15.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-shipping-threshold">Valor Mínimo para Frete Grátis (R$)</Label>
                  <Input id="free-shipping-threshold" type="number" defaultValue="500.00" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Impostos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Taxa de Imposto (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="12" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como e quando você deseja receber notificações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notify-orders" className="flex flex-col space-y-1">
                <span>Novos Pedidos</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receber notificações quando novos pedidos forem realizados.
                </span>
              </Label>
              <Switch id="notify-orders" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notify-low-stock" className="flex flex-col space-y-1">
                <span>Estoque Baixo</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receber alertas quando produtos estiverem com estoque baixo.
                </span>
              </Label>
              <Switch id="notify-low-stock" defaultChecked />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notify-reviews" className="flex flex-col space-y-1">
                <span>Novas Avaliações</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receber notificações quando novos comentários forem publicados.
                </span>
              </Label>
              <Switch id="notify-reviews" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Salvar Preferências</Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
