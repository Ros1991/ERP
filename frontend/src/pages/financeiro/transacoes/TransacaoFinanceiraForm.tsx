import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import transacaoFinanceiraService from '../../../services/financeiro/transacaoFinanceira.service';
import contaService from '../../../services/financeiro/conta.service';
import terceiroService from '../../../services/financeiro/terceiro.service';
import type { TransacaoFinanceira, CreateTransacaoFinanceiraDTO, UpdateTransacaoFinanceiraDTO } from '../../../models/financeiro/TransacaoFinanceira.model';
import type { Conta } from '../../../models/financeiro/Conta.model';
import type { Terceiro } from '../../../models/financeiro/Terceiro.model';

const schema = yup.object({
  contaId: yup.number().required('Conta é obrigatória').positive('Selecione uma conta'),
  terceiroId: yup.number().optional().nullable(),
  tipo: yup.string().oneOf(['RECEITA', 'DESPESA'], 'Tipo inválido').required('Tipo é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória').max(255, 'Descrição deve ter no máximo 255 caracteres'),
  valor: yup.number().required('Valor é obrigatório').positive('Valor deve ser positivo'),
  data: yup.string().required('Data é obrigatória'),
  observacao: yup.string().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TransacaoFinanceiraForm() {
  const { empresaId, transacaoFinanceiraId } = useParams<{ empresaId: string; transacaoFinanceiraId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contas, setContas] = useState<Conta[]>([]);
  const [terceiros, setTerceiros] = useState<Terceiro[]>([]);
  const isEdit = !!transacaoFinanceiraId;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'DESPESA',
      valor: 0,
      data: new Date().toISOString().split('T')[0]
    }
  });

  const tipoWatch = watch('tipo');

  useEffect(() => {
    if (empresaId) {
      loadContas();
      loadTerceiros();
      if (isEdit && transacaoFinanceiraId) {
        loadTransacao();
      }
    }
  }, [empresaId, isEdit, transacaoFinanceiraId]);

  const loadContas = async () => {
    try {
      const response = await contaService.getAll(Number(empresaId), 1, 100);
      setContas(response.data.filter(c => c.ativo));
    } catch (error) {
      console.error('Error loading contas:', error);
      toast.error('Erro ao carregar contas');
    }
  };

  const loadTerceiros = async () => {
    try {
      const response = await terceiroService.getAll(Number(empresaId), 1, 100);
      setTerceiros(response.data.filter(t => t.ativo));
    } catch (error) {
      console.error('Error loading terceiros:', error);
      toast.error('Erro ao carregar terceiros');
    }
  };

  const loadTransacao = async () => {
    try {
      setLoading(true);
      const transacao = await transacaoFinanceiraService.getById(Number(empresaId), Number(transacaoFinanceiraId));
      reset({
        contaId: transacao.contaId,
        terceiroId: transacao.terceiroId || undefined,
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        valor: transacao.valor,
        data: transacao.data.split('T')[0],
        observacao: transacao.observacao
      });
    } catch (error) {
      console.error('Error loading transação:', error);
      toast.error('Erro ao carregar transação financeira');
      navigate(`/empresas/${empresaId}/transacoes-financeiras`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      const payload = {
        ...data,
        terceiroId: data.terceiroId || undefined
      };
      
      if (isEdit) {
        await transacaoFinanceiraService.update(Number(empresaId), Number(transacaoFinanceiraId), payload);
        toast.success('Transação financeira atualizada com sucesso');
      } else {
        const dto: CreateTransacaoFinanceiraDTO = {
          empresaId: Number(empresaId),
          ...payload
        };
        await transacaoFinanceiraService.create(Number(empresaId), dto);
        toast.success('Transação financeira criada com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/transacoes-financeiras`);
    } catch (error) {
      console.error('Error saving transação:', error);
      toast.error(isEdit ? 'Erro ao atualizar transação financeira' : 'Erro ao criar transação financeira');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Transação Financeira' : 'Nova Transação Financeira'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                {...register('tipo')}
                className="select"
                disabled={loading}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta *
              </label>
              <select
                {...register('contaId', { valueAsNumber: true })}
                className="select"
                disabled={loading}
              >
                <option value="">Selecione uma conta</option>
                {contas.map((conta) => (
                  <option key={conta.contaId} value={conta.contaId}>
                    {conta.nome} - {conta.tipo}
                  </option>
                ))}
              </select>
              {errors.contaId && (
                <p className="text-red-500 text-sm mt-1">{errors.contaId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tipoWatch === 'RECEITA' ? 'Cliente' : 'Fornecedor'} (Opcional)
              </label>
              <select
                {...register('terceiroId', { valueAsNumber: true })}
                className="select"
                disabled={loading}
              >
                <option value="">Nenhum</option>
                {terceiros
                  .filter(t => 
                    tipoWatch === 'RECEITA' 
                      ? (t.tipo === 'CLIENTE' || t.tipo === 'AMBOS')
                      : (t.tipo === 'FORNECEDOR' || t.tipo === 'AMBOS')
                  )
                  .map((terceiro) => (
                    <option key={terceiro.terceiroId} value={terceiro.terceiroId}>
                      {terceiro.nome}
                    </option>
                  ))}
              </select>
              {errors.terceiroId && (
                <p className="text-red-500 text-sm mt-1">{errors.terceiroId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data *
              </label>
              <input
                type="date"
                {...register('data')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.data && (
                <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <input
                type="text"
                {...register('descricao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="Descrição da transação..."
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valor', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.valor && (
                <p className="text-red-500 text-sm mt-1">{errors.valor.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              {...register('observacao')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Observações adicionais sobre a transação..."
            />
            {errors.observacao && (
              <p className="text-red-500 text-sm mt-1">{errors.observacao.message}</p>
            )}
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
              onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras`)}
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
