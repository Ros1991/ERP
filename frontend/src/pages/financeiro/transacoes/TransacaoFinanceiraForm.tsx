import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import transacaoFinanceiraService from '../../../services/financeiro/transacaoFinanceira.service';
import contaService from '../../../services/financeiro/conta.service';
import terceiroService from '../../../services/financeiro/terceiro.service';
import type { CreateTransacaoFinanceiraDTO } from '../../../models/financeiro/TransacaoFinanceira.model';
import type { Conta } from '../../../models/financeiro/Conta.model';
import type { Terceiro } from '../../../models/financeiro/Terceiro.model';

const schema = yup.object({
  contaId: yup.number().required('Conta é obrigatória').positive('Selecione uma conta'),
  terceiroId: yup.number().optional().nullable(),
  tipo: yup.string().oneOf(['RECEITA', 'DESPESA'], 'Tipo inválido').required('Tipo é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória').max(255, 'Descrição deve ter no máximo 255 caracteres'),
  valor: yup.number().required('Valor é obrigatório').positive('Valor deve ser positivo'),
  dataTransacao: yup.string().required('Data é obrigatória'),
  observacoes: yup.string().optional()
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
      dataTransacao: new Date().toISOString().split('T')[0]
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
      setContas(response.data.filter(c => c.ativa));
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
        dataTransacao: transacao.dataTransacao.split('T')[0],
        observacoes: transacao.observacoes
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras`)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Transação Financeira' : 'Nova Transação Financeira'}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tipo *
              </label>
              <select
                {...register('tipo')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={loading}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.tipo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Conta *
              </label>
              <select
                {...register('contaId', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.contaId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {tipoWatch === 'RECEITA' ? 'Cliente' : 'Fornecedor'} (Opcional)
              </label>
              <select
                {...register('terceiroId', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.terceiroId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Data *
              </label>
              <input
                type="date"
                {...register('dataTransacao')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={loading}
              />
              {errors.dataTransacao && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.dataTransacao.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                {...register('descricao')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={loading}
                placeholder="Descrição da transação..."
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Valor *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valor', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={loading}
                placeholder="0,00"
              />
              {errors.valor && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.valor.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Observações
            </label>
            <textarea
              {...register('observacoes')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
              disabled={loading}
              placeholder="Observações adicionais sobre a transação..."
            />
            {errors.observacoes && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <X className="h-4 w-4" />
                {errors.observacoes.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? 'Atualizar' : 'Criar'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras`)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium"
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
