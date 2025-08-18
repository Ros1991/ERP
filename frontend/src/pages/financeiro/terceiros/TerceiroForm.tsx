import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import terceiroService from '../../../services/financeiro/terceiro.service';
import type { CreateTerceiroDTO } from '../../../models/financeiro/Terceiro.model';

const schema = yup.object({
  tipo: yup.string().oneOf(
    ['CLIENTE', 'FORNECEDOR', 'AMBOS'],
    'Tipo inválido'
  ).required('Tipo é obrigatório'),
  nome: yup.string().required('Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
  cnpjCpf: yup.string().optional().max(18, 'CNPJ/CPF deve ter no máximo 18 caracteres'),
  telefone: yup.string().optional().max(20, 'Telefone deve ter no máximo 20 caracteres'),
  email: yup.string().email('Email inválido').optional(),
  endereco: yup.string().optional(),
  ativo: yup.boolean().optional().default(true)
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TerceiroForm() {
  const { empresaId, terceiroId } = useParams<{ empresaId: string; terceiroId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!terceiroId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'CLIENTE',
      ativo: true
    }
  });

  useEffect(() => {
    if (isEdit && empresaId && terceiroId) {
      loadTerceiro();
    }
  }, [isEdit, empresaId, terceiroId]);

  const loadTerceiro = async () => {
    try {
      setLoading(true);
      const terceiro = await terceiroService.getById(Number(empresaId), Number(terceiroId));
      reset({
        tipo: terceiro.tipo,
        nome: terceiro.nome,
        cnpjCpf: terceiro.cnpjCpf,
        telefone: terceiro.telefone,
        email: terceiro.email,
        endereco: terceiro.endereco,
        ativo: terceiro.ativo
      });
    } catch (error) {
      console.error('Error loading terceiro:', error);
      toast.error('Erro ao carregar terceiro');
      navigate(`/empresas/${empresaId}/terceiros`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      console.log('🔍 Form data before processing:', data);
      
      if (isEdit) {
        console.log('📝 Sending UPDATE data:', data);
        await terceiroService.update(Number(empresaId), Number(terceiroId), data);
        toast.success('Terceiro atualizado com sucesso');
      } else {
        const dto: CreateTerceiroDTO = {
          empresaId: Number(empresaId),
          ...data,
          // Garantir que campos vazios virem undefined
          cnpjCpf: data.cnpjCpf || undefined,
          telefone: data.telefone || undefined,
          email: data.email || undefined,
          endereco: data.endereco || undefined
        };
        console.log('📝 Sending CREATE DTO:', dto);
        await terceiroService.create(Number(empresaId), dto);
        toast.success('Terceiro criado com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/terceiros`);
    } catch (error: any) {
      console.error('❌ Error saving terceiro:', error);
      console.error('❌ Error details:', error.response?.data);
      toast.error(isEdit ? 'Erro ao atualizar terceiro' : 'Erro ao criar terceiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Terceiro' : 'Novo Terceiro'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              {...register('tipo')}
              className="select"
              disabled={loading}
            >
              <option value="CLIENTE">Cliente</option>
              <option value="FORNECEDOR">Fornecedor</option>
              <option value="AMBOS">Ambos</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              {...register('nome')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ/CPF
            </label>
            <input
              type="text"
              {...register('cnpjCpf')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Digite o CNPJ ou CPF"
            />
            {errors.cnpjCpf && (
              <p className="text-red-500 text-sm mt-1">{errors.cnpjCpf.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                {...register('telefone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              {...register('endereco')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Rua, número, bairro, cidade - UF"
            />
            {errors.endereco && (
              <p className="text-red-500 text-sm mt-1">{errors.endereco.message}</p>
            )}
          </div>


          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('ativo')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <label className="ml-2 text-sm text-gray-700">
              Terceiro Ativo
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/terceiros`)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
