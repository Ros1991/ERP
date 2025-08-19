import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import pedidoCompraService from '../../services/compras/pedidoCompra.service';
import terceiroService from '../../services/financeiro/terceiro.service';
import centroCustoService from '../../services/financeiro/centroCusto.service';
import type { PedidoCompra } from '@/models/compras/PedidoCompra.model';
import type { Terceiro } from '@/models/financeiro/Terceiro.model';
import type { CentroCusto } from '@/models/financeiro/CentroCusto.model';

const schema = yup.object({
  descricao: yup.string().required('Descrição é obrigatória'),
  terceiroId: yup.number().optional(),
  centroCustoId: yup.number().optional(),
  valorEstimado: yup.number().positive('Valor deve ser positivo').optional(),
  dataSolicitacao: yup.string().required('Data de solicitação é obrigatória'),
  status: yup.string().oneOf(['PENDENTE', 'APROVADO', 'COMPRADO', 'CANCELADO']).required('Status é obrigatório'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function PedidoCompraForm() {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [terceiros, setTerceiros] = useState<Terceiro[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PENDENTE',
      dataSolicitacao: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (empresaId) {
      loadTerceiros();
      loadCentrosCusto();
      if (id) loadPedido();
    }
  }, [empresaId, id]);

  const loadTerceiros = async () => {
    if (!empresaId) return;
    try {
      const response = await terceiroService.getAll(parseInt(empresaId), 1, 100);
      setTerceiros(response.data.filter(t => t.ativo));
    } catch (error) {
      console.error('Erro ao carregar terceiros:', error);
    }
  };

  const loadCentrosCusto = async () => {
    if (!empresaId) return;
    try {
      const response = await centroCustoService.getAll(parseInt(empresaId), 1, 100);
      setCentrosCusto(response.data.filter(c => c.ativo));
    } catch (error) {
      console.error('Erro ao carregar centros de custo:', error);
    }
  };

  const loadPedido = async () => {
    if (!empresaId || !id) return;
    try {
      setLoadingData(true);
      const pedido = await pedidoCompraService.getById(parseInt(empresaId), parseInt(id));
      reset({
        descricao: pedido.descricao,
        terceiroId: pedido.terceiroId,
        centroCustoId: pedido.centroCustoId,
        valorEstimado: pedido.valorEstimado || undefined,
        dataSolicitacao: new Date(pedido.dataSolicitacao).toISOString().split('T')[0],
        status: pedido.status,
      });
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      toast.error('Erro ao carregar pedido');
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const pedidoData: Partial<PedidoCompra> = {
        ...data,
        empresaId: parseInt(empresaId),
      };

      if (id) {
        await pedidoCompraService.update(parseInt(empresaId), parseInt(id), pedidoData);
        toast.success('Pedido atualizado com sucesso');
      } else {
        await pedidoCompraService.create(parseInt(empresaId), pedidoData as PedidoCompra);
        toast.success('Pedido criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } catch (error: any) {
      console.error('Erro ao salvar pedido:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar Pedido de Compra' : 'Novo Pedido de Compra'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              {...register('descricao')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
              placeholder="Descrição detalhada do pedido de compra..."
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor
              </label>
              <select
                {...register('terceiroId')}
                className="select"
                disabled={loading}
              >
                <option value="">Selecione um fornecedor</option>
                {terceiros.map((terceiro) => (
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
                Centro de Custo
              </label>
              <select
                {...register('centroCustoId')}
                className="select"
                disabled={loading}
              >
                <option value="">Selecione um centro de custo</option>
                {centrosCusto.map((centro) => (
                  <option key={centro.centroCustoId} value={centro.centroCustoId}>
                    {centro.nome}
                  </option>
                ))}
              </select>
              {errors.centroCustoId && (
                <p className="text-red-500 text-sm mt-1">{errors.centroCustoId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Estimado
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valorEstimado')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="0,00"
              />
              {errors.valorEstimado && (
                <p className="text-red-500 text-sm mt-1">{errors.valorEstimado.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="select"
                disabled={loading}
              >
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADO">Aprovado</option>
                <option value="COMPRADO">Comprado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Solicitação *
            </label>
            <input
              type="date"
              {...register('dataSolicitacao')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.dataSolicitacao && (
              <p className="text-red-500 text-sm mt-1">{errors.dataSolicitacao.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/pedidos-compra`)}
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
