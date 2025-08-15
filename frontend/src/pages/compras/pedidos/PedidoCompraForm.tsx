import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import pedidoCompraService from '@/services/compras/pedidoCompra.service';
import terceiroService from '@/services/financeiro/terceiro.service';
import { CreatePedidoCompraDTO } from '@/models/compras/PedidoCompra.model';
import { Terceiro } from '@/models/financeiro/Terceiro.model';

const schema = yup.object({
  terceiroId: yup.number().required('Fornecedor é obrigatório').positive('Selecione um fornecedor'),
  numero: yup.string().required('Número do pedido é obrigatório').max(50, 'Número deve ter no máximo 50 caracteres'),
  data: yup.string().required('Data do pedido é obrigatória'),
  prazoEntrega: yup.string().optional(),
  status: yup.string().oneOf(
    ['PENDENTE', 'APROVADO', 'RECUSADO', 'ENTREGUE', 'CANCELADO'],
    'Status inválido'
  ).optional().default('PENDENTE'),
  valorTotal: yup.number().required('Valor total é obrigatório').min(0, 'Valor deve ser positivo'),
  observacao: yup.string().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function PedidoCompraForm() {
  const { empresaId, pedidoCompraId } = useParams<{ empresaId: string; pedidoCompraId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<Terceiro[]>([]);
  const isEdit = !!pedidoCompraId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PENDENTE',
      valorTotal: 0
    }
  });

  useEffect(() => {
    if (empresaId) {
      loadFornecedores();
      if (isEdit && pedidoCompraId) {
        loadPedidoCompra();
      }
    }
  }, [empresaId, isEdit, pedidoCompraId]);

  const loadFornecedores = async () => {
    try {
      const response = await terceiroService.getAll(Number(empresaId), 1, 100);
      // Filter only suppliers (FORNECEDOR or AMBOS)
      const suppliers = response.data.filter(t => t.tipo === 'FORNECEDOR' || t.tipo === 'AMBOS');
      setFornecedores(suppliers);
    } catch (error) {
      console.error('Error loading fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    }
  };

  const loadPedidoCompra = async () => {
    try {
      setLoading(true);
      const pedido = await pedidoCompraService.getById(Number(empresaId), Number(pedidoCompraId));
      reset({
        terceiroId: pedido.terceiroId,
        numero: pedido.numero,
        data: pedido.data.split('T')[0], // Format for date input
        prazoEntrega: pedido.prazoEntrega ? pedido.prazoEntrega.split('T')[0] : undefined,
        status: pedido.status,
        valorTotal: pedido.valorTotal,
        observacao: pedido.observacao
      });
    } catch (error) {
      console.error('Error loading pedido:', error);
      toast.error('Erro ao carregar pedido de compra');
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await pedidoCompraService.update(Number(empresaId), Number(pedidoCompraId), data);
        toast.success('Pedido de compra atualizado com sucesso');
      } else {
        const dto: CreatePedidoCompraDTO = {
          empresaId: Number(empresaId),
          ...data
        };
        await pedidoCompraService.create(Number(empresaId), dto);
        toast.success('Pedido de compra criado com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/pedidos-compra`);
    } catch (error) {
      console.error('Error saving pedido:', error);
      toast.error(isEdit ? 'Erro ao atualizar pedido de compra' : 'Erro ao criar pedido de compra');
    } finally {
      setLoading(false);
    }
  };

  // Generate next order number
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PED-${year}${month}${day}-${random}`;
  };

  useEffect(() => {
    if (!isEdit) {
      // Set default values for new pedido
      reset(prev => ({
        ...prev,
        numero: generateOrderNumber(),
        data: new Date().toISOString().split('T')[0]
      }));
    }
  }, [isEdit, reset]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Pedido de Compra' : 'Novo Pedido de Compra'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor *
              </label>
              <select
                {...register('terceiroId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.terceiroId} value={fornecedor.terceiroId}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
              {errors.terceiroId && (
                <p className="text-red-500 text-sm mt-1">{errors.terceiroId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Pedido *
              </label>
              <input
                type="text"
                {...register('numero')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.numero && (
                <p className="text-red-500 text-sm mt-1">{errors.numero.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Pedido *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo de Entrega
              </label>
              <input
                type="date"
                {...register('prazoEntrega')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.prazoEntrega && (
                <p className="text-red-500 text-sm mt-1">{errors.prazoEntrega.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADO">Aprovado</option>
                <option value="RECUSADO">Recusado</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valorTotal', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.valorTotal && (
                <p className="text-red-500 text-sm mt-1">{errors.valorTotal.message}</p>
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
              placeholder="Observações adicionais sobre o pedido..."
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
