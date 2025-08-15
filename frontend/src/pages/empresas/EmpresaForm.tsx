import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { empresaService } from '../../services/empresa/empresa.service';
import type { Empresa } from '../../models/empresa/Empresa.model';

const EmpresaSchema = yup.object({
  nome: yup.string().min(3, 'Nome deve ter no mínimo 3 caracteres').required('Nome é obrigatório'),
  cnpj: yup.string().optional(),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  telefone: yup.string().optional(),
  endereco: yup.string().optional(),
  cidade: yup.string().optional(),
  estado: yup.string().max(2, 'Use a sigla do estado').optional(),
  cep: yup.string().optional(),
  ativo: yup.boolean().default(true),
});

type EmpresaFormData = yup.InferType<typeof EmpresaSchema>;

export function EmpresaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmpresaFormData>({
    resolver: yupResolver(EmpresaSchema) as any,
    defaultValues: {
      ativo: true,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadEmpresa(parseInt(id));
    }
  }, [id]);

  const loadEmpresa = async (empresaId: number) => {
    try {
      setLoadingData(true);
      const empresa = await empresaService.getById(String(empresaId));
      setEmpresa(empresa);
      reset({
        nome: empresa.nome,
        cnpj: empresa.cnpj || '',
        email: empresa.email,
        telefone: empresa.telefone || '',
        endereco: empresa.endereco || '',
        cidade: empresa.cidade || '',
        estado: empresa.estado || '',
        cep: empresa.cep || '',
        ativo: empresa.ativo,
      });
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      toast.error('Erro ao carregar dados da empresa');
      navigate('/empresas');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      setLoading(true);
      
      if (isEditing && id) {
        empresa ? await empresaService.update(String(empresa.id), data as any) : await empresaService.create(data as any);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await empresaService.create(data as any);
        toast.success('Empresa criada com sucesso!');
      }
      
      navigate('/empresas');
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/empresas')}
          variant="ghost"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Empresa' : 'Nova Empresa'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEditing ? 'Atualize os dados da empresa' : 'Preencha os dados da nova empresa'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary-600" />
              Dados da Empresa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('nome')}
                label="Nome da Empresa *"
                placeholder="Nome completo da empresa"
                error={errors.nome?.message}
              />
              
              <Input
                {...register('cnpj')}
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                error={errors.cnpj?.message}
              />
              
              <Input
                {...register('email')}
                type="email"
                label="E-mail *"
                placeholder="empresa@email.com"
                error={errors.email?.message}
              />
              
              <Input
                {...register('telefone')}
                label="Telefone"
                placeholder="(00) 00000-0000"
                error={errors.telefone?.message}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Endereço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('endereco')}
                label="Endereço"
                placeholder="Rua, número, complemento"
                error={errors.endereco?.message}
                className="md:col-span-2"
              />
              
              <Input
                {...register('cidade')}
                label="Cidade"
                placeholder="Nome da cidade"
                error={errors.cidade?.message}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('estado')}
                  label="Estado"
                  placeholder="UF"
                  maxLength={2}
                  error={errors.estado?.message}
                />
                
                <Input
                  {...register('cep')}
                  label="CEP"
                  placeholder="00000-000"
                  error={errors.cep?.message}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              {...register('ativo')}
              type="checkbox"
              id="ativo"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="ativo" className="text-sm text-gray-700 dark:text-gray-300">
              Empresa ativa
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/empresas')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              icon={<Save className="h-5 w-5" />}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Empresa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
