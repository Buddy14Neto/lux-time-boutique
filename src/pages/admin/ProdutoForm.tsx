
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Loader, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Schema de validação para o formulário com os campos específicos para relógios
const productFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  brand: z.string().min(1, "Marca é obrigatória"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  discount_price: z.coerce.number().positive("Preço com desconto deve ser maior que zero").optional().nullable(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  short_description: z.string().min(10, "Resumo deve ter pelo menos 10 caracteres"),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  new_arrival: z.boolean().default(false),
  reference: z.string().min(1, "Referência é obrigatória"),
  case_material: z.string().min(1, "Material da caixa é obrigatório"),
  case_diameter: z.string().min(1, "Diâmetro da caixa é obrigatório"),
  movement: z.string().min(1, "Movimento é obrigatório"),
  power_reserve: z.string().min(1, "Reserva de energia é obrigatória"),
  water_resistance: z.string().min(1, "Resistência à água é obrigatória"),
  crystal: z.string().min(1, "Cristal é obrigatório"),
  dial_color: z.string().min(1, "Cor do mostrador é obrigatória"),
  strap_material: z.string().min(1, "Material da pulseira é obrigatória"),
  functions: z.string().transform(val => val.split(',').map(v => v.trim()).filter(Boolean)),
  style: z.string().transform(val => val.split(',').map(v => v.trim()).filter(Boolean)),
});

// Tipo baseado no schema
type WatchProduct = z.infer<typeof productFormSchema>;

export default function ProdutoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Inicialização do formulário
  const form = useForm<WatchProduct>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      discount_price: null,
      description: "",
      short_description: "",
      featured: false,
      bestseller: false,
      new_arrival: false,
      reference: "",
      case_material: "",
      case_diameter: "",
      movement: "",
      power_reserve: "",
      water_resistance: "",
      crystal: "",
      dial_color: "",
      strap_material: "",
      functions: [],
      style: [],
    }
  });

  // Observa o valor do campo preço para garantir que o preço com desconto seja menor
  const price = useWatch({
    control: form.control,
    name: 'price'
  });

  // Carrega os dados do produto se estiver editando
  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  const fetchProductData = async (productId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Transforma os arrays para string para o formulário
        const functionsStr = data.functions ? data.functions.join(', ') : '';
        const styleStr = data.style ? data.style.join(', ') : '';

        // Define os valores iniciais do formulário
        form.reset({
          name: data.name,
          brand: data.brand,
          price: data.price,
          discount_price: data.discount_price,
          description: data.description,
          short_description: data.short_description,
          featured: data.featured || false,
          bestseller: data.bestseller || false,
          new_arrival: data.new_arrival || false,
          reference: data.reference,
          case_material: data.case_material,
          case_diameter: data.case_diameter,
          movement: data.movement,
          power_reserve: data.power_reserve,
          water_resistance: data.water_resistance,
          crystal: data.crystal,
          dial_color: data.dial_color,
          strap_material: data.strap_material,
          functions: data.functions,
          style: data.style,
        });

        // Salva as imagens existentes
        setExistingImages(data.images || []);
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os dados do produto.'
      });
      navigate('/admin/produtos');
    } finally {
      setLoading(false);
    }
  };

  // Função para enviar as imagens para o storage
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  // Manipula o envio do formulário
  const onSubmit = async (data: WatchProduct) => {
    setLoading(true);
    try {
      let imageUrls = [...existingImages];
      
      // Faz upload de novas imagens, se houver
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const uploadedUrls = await uploadImages(imageFiles);
        setUploadingImages(false);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      // Prepara os dados para salvar - garantindo que todos os campos requeridos estejam presentes
      const productData = {
        name: data.name,
        brand: data.brand,
        price: data.price,
        discount_price: data.discount_price,
        description: data.description,
        short_description: data.short_description,
        featured: data.featured,
        bestseller: data.bestseller,
        new_arrival: data.new_arrival,
        reference: data.reference,
        case_material: data.case_material,
        case_diameter: data.case_diameter,
        movement: data.movement,
        power_reserve: data.power_reserve,
        water_resistance: data.water_resistance,
        crystal: data.crystal,
        dial_color: data.dial_color,
        strap_material: data.strap_material,
        functions: data.functions,
        style: data.style,
        images: imageUrls,
      };

      let result;

      if (id) {
        // Atualiza um produto existente
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
      } else {
        // Insere um novo produto
        result = await supabase
          .from('products')
          .insert(productData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: id ? 'Produto atualizado' : 'Produto criado',
        description: id ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.',
      });

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Não foi possível ${id ? 'atualizar' : 'criar'} o produto.`
      });
    } finally {
      setLoading(false);
    }
  };

  // Manipula a seleção de arquivos de imagem
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);
  };

  // Remove um arquivo da lista de arquivos a serem enviados
  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove uma imagem existente
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout title={id ? "Editar Produto" : "Novo Produto"}>
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/produtos')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Produtos
      </Button>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Marca do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço com Desconto (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0,00" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              field.onChange(val);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Deixe em branco se não houver desconto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Curta</FormLabel>
                        <FormControl>
                          <Input placeholder="Breve descrição do produto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Completa</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição detalhada do produto" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Destaque</FormLabel>
                          <FormDescription>
                            Mostrar na seção de produtos em destaque
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bestseller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Mais Vendido</FormLabel>
                          <FormDescription>
                            Marcar como produto mais vendido
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="new_arrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Novidade</FormLabel>
                          <FormDescription>
                            Marcar como novo produto
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Especificações Técnicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referência</FormLabel>
                        <FormControl>
                          <Input placeholder="Código de referência" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material da Caixa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aço inoxidável" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_diameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diâmetro da Caixa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 40mm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="movement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Movimento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Automático" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="power_reserve"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reserva de Energia</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 48 horas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="water_resistance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resistência à Água</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 100m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="crystal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cristal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Safira" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dial_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do Mostrador</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Preto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="strap_material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material da Pulseira</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Couro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="functions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funções</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Data, Cronógrafo, GMT (separados por vírgula)" 
                            {...field} 
                            value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>Separe as funções com vírgula</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Casual, Formal, Esportivo (separados por vírgula)" 
                            {...field} 
                            value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>Separe os estilos com vírgula</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Imagens do Produto</h3>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Imagens
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <FormDescription>
                      Você pode selecionar múltiplas imagens
                    </FormDescription>
                  </div>
                </div>

                {/* Imagens existentes */}
                {existingImages.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Imagens Existentes</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Produto ${index + 1}`}
                            className="h-40 w-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeExistingImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </>
                )}

                {/* Novas imagens para upload */}
                {imageFiles.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Novas Imagens</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="h-40 w-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeImageFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {existingImages.length === 0 && imageFiles.length === 0 && (
                  <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
                    Nenhuma imagem selecionada.
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/produtos')}
                disabled={loading || uploadingImages}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || uploadingImages}
                className="bg-gold-DEFAULT hover:bg-gold-dark"
              >
                {(loading || uploadingImages) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {id ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
