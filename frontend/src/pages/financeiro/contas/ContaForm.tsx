import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import contaService from '../../../services/financeiro/conta.service';
import type { Conta, CreateContaDTO, UpdateContaDTO } from '../../../models/financeiro/Conta.model';

const schema = yup.object({
  tipo: yup.string().oneOf(
    ['SOCIO', 'EMPRESA', 'BANCO', 'CAIXA'],
    'Tipo inválido'
  ).required('Tipo é obrigatório'),
  nome: yup.string().required('Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
  socioId: yup.number().nullable().optional().transform((value) => (value === '' ? null : value)),
  bancoId: yup.number().nullable().optional().transform((value) => (value === '' ? null : value)),
  saldo: yup.number().optional().default(0),
  ativo: yup.boolean().optional().default(true)
}).required();

type FormData = yup.InferType<typeof schema>;

export default function ContaForm() {
  const { empresaId, contaId } = useParams<{ empresaId: string; contaId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!contaId;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'BANCO',
      saldo: 0,
      ativo: true
    }
  });

  const tipoValue = watch('tipo');

  useEffect(() => {
    if (isEdit && empresaId && contaId) {
      loadConta();
    }
  }, [isEdit, empresaId, contaId]);

  const loadConta = async () => {
    try {
      setLoading(true);
      const conta = await contaService.getById(Number(empresaId), Number(contaId));
      reset({
        tipo: conta.tipo,
        nome: conta.nome,
        socioId: conta.socioId,
        bancoId: conta.bancoId,
        saldo: conta.saldo,
        ativo: conta.ativo
      });
    } catch (error) {
      console.error('Error loading conta:', error);
      toast.error('Erro ao carregar conta');
      navigate(`/empresas/${empresaId}/contas`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await contaService.update(Number(empresaId), Number(contaId), data);
        toast.success('Conta atualizada com sucesso');
      } else {
        const dto: CreateContaDTO = {
          empresaId: Number(empresaId),
          ...data
        };
        await contaService.create(Number(empresaId), dto);
        toast.success('Conta criada com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/contas`);
    } catch (error) {
      console.error('Error saving conta:', error);
      toast.error(isEdit ? 'Erro ao atualizar conta' : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Conta' : 'Nova Conta'}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || isEdit}
            >
              <option value="BANCO">Banco</option>
              <option value="CAIXA">Caixa</option>
              <option value="EMPRESA">Empresa</option>
              <option value="SOCIO">Sócio</option>
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

          {tipoValue === 'SOCIO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Sócio
              </label>
              <input
                type="number"
                {...register('socioId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="Informe o ID do sócio (opcional)"
              />
              {errors.socioId && (
                <p className="text-red-500 text-sm mt-1">{errors.socioId.message}</p>
              )}
            </div>
          )}

          {tipoValue === 'BANCO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Banco
              </label>
              <input
                type="number"
                {...register('bancoId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="Informe o ID do banco (opcional)"
              />
              {errors.bancoId && (
                <p className="text-red-500 text-sm mt-1">{errors.bancoId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo Inicial
            </label>
            <input
              type="number"
              step="0.01"
              {...register('saldo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.saldo && (
              <p className="text-red-500 text-sm mt-1">{errors.saldo.message}</p>
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
              Conta Ativa
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
              onClick={() => navigate(`/empresas/${empresaId}/contas`)}
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
