
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  WatchBrand, 
  WatchMaterial, 
  WatchStyle,
  WatchProduct
} from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Save, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'crypto';

type ProductFormData = Omit<WatchProduct, 'id'> & { id?: string };

const initialFormData: ProductFormData = {
  name: '',
  brand: 'Rolex',
  price: 0,
  discountPrice: undefined,
  description: '',
  shortDescription: '',
  images: [''],
  featured: false,
  bestseller: false,
  newArrival: false,
  specifications: {
    reference: '',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '',
    movement: '',
    powerReserve: '',
    waterResistance: '',
    crystal: '',
    dialColor: '',
    strapMaterial: 'Stainless Steel',
    functions: []
  },
  style: ['Dress']
};

const watchBrands: WatchBrand[] = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 
  'Tag Heuer', 'Breitling', 'Cartier', 'IWC Schaffhausen', 
  'Hublot', 'Jaeger-LeCoultre'
];

const watchMaterials: WatchMaterial[] = [
  'Stainless Steel', 'Gold', 'Rose Gold', 'Platinum', 
  'Titanium', 'Ceramic', 'Carbon Fiber', 'Leather'
];

const watchStyles: WatchStyle[] = [
  'Dress', 'Dive', 'Sports', 'Pilot', 'Chronograph', 
  'Skeleton', 'Smart', 'Military'
];

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const product = data as unknown as WatchProduct;
        setFormData({
          ...product,
          specifications: {
            reference: product.reference,
            caseMaterial: product.case_material as WatchMaterial,
            caseDiameter: product.case_diameter,
            movement: product.movement,
            powerReserve: product.power_reserve,
            waterResistance: product.water_resistance,
            crystal: product.crystal,
            dialColor: product.dial_color,
            strapMaterial: product.strap_material as WatchMaterial,
            functions: product.functions
          },
          style: product.style as WatchStyle[]
        });
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os dados do produto.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecificationChange = (field: keyof WatchProduct['specifications'], value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleStyleChange = (style: WatchStyle) => {
    const currentStyles = formData.style || [];
    const newStyles = currentStyles.includes(style) 
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style];
    
    setFormData(prev => ({
      ...prev,
      style: newStyles
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleFunctionChange = (index: number, value: string) => {
    const newFunctions = [...formData.specifications.functions];
    newFunctions[index] = value;
    
    handleSpecificationChange('functions', newFunctions);
  };

  const addFunctionField = () => {
    handleSpecificationChange('functions', [...formData.specifications.functions, '']);
  };

  const removeFunctionField = (index: number) => {
    const newFunctions = [...formData.specifications.functions];
    newFunctions.splice(index, 1);
    
    handleSpecificationChange('functions', newFunctions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data for Supabase (flatten specifications)
      const productData = {
        name: formData.name,
        brand: formData.brand,
        price: formData.price,
        discount_price: formData.discountPrice,
        description: formData.description,
        short_description: formData.shortDescription,
        images: formData.images,
        featured: formData.featured,
        bestseller: formData.bestseller,
        new_arrival: formData.newArrival,
        reference: formData.specifications.reference,
        case_material: formData.specifications.caseMaterial,
        case_diameter: formData.specifications.caseDiameter,
        movement: formData.specifications.movement,
        power_reserve: formData.specifications.powerReserve,
        water_resistance: formData.specifications.waterResistance,
        crystal: formData.specifications.crystal,
        dial_color: formData.specifications.dialColor,
        strap_material: formData.specifications.strapMaterial,
        functions: formData.specifications.functions,
        style: formData.style
      };
      
      let error;
      
      if (isEditing) {
        const response = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        
        error = response.error;
      } else {
        const response = await supabase
          .from('products')
          .insert(productData);
        
        error = response.error;
      }

      if (error) {
        throw error;
      }

      toast({
        title: isEditing ? 'Produto atualizado' : 'Produto criado',
        description: isEditing 
          ? 'Produto atualizado com sucesso.' 
          : 'Novo produto adicionado com sucesso.'
      });

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Não foi possível ${isEditing ? 'atualizar' : 'criar'} o produto.`
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? 'Editar Produto' : 'Novo Produto'}>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Editar Produto' : 'Novo Produto'}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input 
                  id="name" 
                  placeholder="Nome do produto" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Select 
                  value={formData.brand} 
                  onValueChange={(value) => handleChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input 
                  id="price" 
                  type="number"
                  min="0"
                  step="0.01" 
                  placeholder="0,00" 
                  value={formData.price} 
                  onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Preço com Desconto (R$)</Label>
                <Input 
                  id="discountPrice" 
                  type="number"
                  min="0"
                  step="0.01" 
                  placeholder="0,00" 
                  value={formData.discountPrice || ''} 
                  onChange={(e) => handleChange('discountPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shortDescription">Descrição Curta *</Label>
                <Input 
                  id="shortDescription" 
                  placeholder="Breve descrição do produto" 
                  value={formData.shortDescription} 
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição Completa *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descrição detalhada do produto" 
                  value={formData.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="min-h-32" 
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Imagens do Produto</h2>
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input 
                      placeholder="URL da imagem" 
                      value={image} 
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      required
                    />
                  </div>
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeImageField(index)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {image && (
                    <div className="w-16 h-16 border rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addImageField}
              >
                Adicionar Imagem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Especificações */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reference">Referência *</Label>
                <Input 
                  id="reference" 
                  placeholder="ex: 126610LN" 
                  value={formData.specifications.reference} 
                  onChange={(e) => handleSpecificationChange('reference', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseMaterial">Material da Caixa *</Label>
                <Select 
                  value={formData.specifications.caseMaterial} 
                  onValueChange={(value) => handleSpecificationChange('caseMaterial', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchMaterials.map((material) => (
                      <SelectItem key={material} value={material}>{material}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseDiameter">Diâmetro da Caixa *</Label>
                <Input 
                  id="caseDiameter" 
                  placeholder="ex: 41mm" 
                  value={formData.specifications.caseDiameter} 
                  onChange={(e) => handleSpecificationChange('caseDiameter', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movement">Movimento *</Label>
                <Input 
                  id="movement" 
                  placeholder="ex: Automático" 
                  value={formData.specifications.movement} 
                  onChange={(e) => handleSpecificationChange('movement', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="powerReserve">Reserva de Marcha *</Label>
                <Input 
                  id="powerReserve" 
                  placeholder="ex: 72 horas" 
                  value={formData.specifications.powerReserve} 
                  onChange={(e) => handleSpecificationChange('powerReserve', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterResistance">Resistência à Água *</Label>
                <Input 
                  id="waterResistance" 
                  placeholder="ex: 300m" 
                  value={formData.specifications.waterResistance} 
                  onChange={(e) => handleSpecificationChange('waterResistance', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crystal">Cristal *</Label>
                <Input 
                  id="crystal" 
                  placeholder="ex: Safira" 
                  value={formData.specifications.crystal} 
                  onChange={(e) => handleSpecificationChange('crystal', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dialColor">Cor do Mostrador *</Label>
                <Input 
                  id="dialColor" 
                  placeholder="ex: Preto" 
                  value={formData.specifications.dialColor} 
                  onChange={(e) => handleSpecificationChange('dialColor', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strapMaterial">Material da Pulseira *</Label>
                <Select 
                  value={formData.specifications.strapMaterial} 
                  onValueChange={(value) => handleSpecificationChange('strapMaterial', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchMaterials.map((material) => (
                      <SelectItem key={material} value={material}>{material}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Funções *</Label>
                {formData.specifications.functions.map((func, index) => (
                  <div key={index} className="flex items-center gap-4 mt-2">
                    <div className="flex-1">
                      <Input 
                        placeholder="ex: Data, Cronógrafo" 
                        value={func} 
                        onChange={(e) => handleFunctionChange(index, e.target.value)}
                        required
                      />
                    </div>
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFunctionField(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addFunctionField}
                  className="mt-2"
                >
                  Adicionar Função
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estilo e Categorização */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Estilo e Categorização</h2>
            
            <div className="mb-6">
              <Label className="mb-3 block">Estilo do Relógio *</Label>
              <div className="flex flex-wrap gap-2">
                {watchStyles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Switch
                      id={`style-${style}`}
                      checked={formData.style.includes(style)}
                      onCheckedChange={() => handleStyleChange(style)}
                    />
                    <Label htmlFor={`style-${style}`}>{style}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured || false}
                  onCheckedChange={(checked) => handleChange('featured', checked)}
                />
                <Label htmlFor="featured">Produto em Destaque</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="bestseller"
                  checked={formData.bestseller || false}
                  onCheckedChange={(checked) => handleChange('bestseller', checked)}
                />
                <Label htmlFor="bestseller">Mais Vendido</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="newArrival"
                  checked={formData.newArrival || false}
                  onCheckedChange={(checked) => handleChange('newArrival', checked)}
                />
                <Label htmlFor="newArrival">Novidade</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/produtos')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Atualizar Produto' : 'Criar Produto'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
