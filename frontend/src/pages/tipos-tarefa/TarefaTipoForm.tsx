import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import tarefaTipoService from '../../services/tarefa/tarefaTipo.service';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import centroCustoService from '../../services/financeiro/centroCusto.service';
import type { TarefaTipo } from '../../models/tarefa/TarefaTipo.model';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';
import type { CentroCusto } from '../../models/financeiro/CentroCusto.model';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  gerenteFuncionarioId: yup.number().optional(),
  centroCustoId: yup.number().optional(),
  cor: yup.string().optional(),
  ativo: yup.boolean().optional().default(true),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TarefaTipoForm() {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ativo: true,
      cor: '#3B82F6'
    }
  });

  useEffect(() => {
    if (empresaId) {
      loadFuncionarios();
      loadCentrosCusto();
      if (id) loadTarefaTipo();
    }
  }, [empresaId, id]);

  const loadFuncionarios = async () => {
    if (!empresaId) return;
    try {
      const response = await funcionarioService.getAll(parseInt(empresaId), 1, 100);
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const loadCentrosCusto = async () => {
    if (!empresaId) return;
    try {
      const response = await centroCustoService.getAll(parseInt(empresaId), 1, 100);
      setCentrosCusto(response.data);
    } catch (error) {
      console.error('Erro ao carregar centros de custo:', error);
    }
  };

  const loadTarefaTipo = async () => {
    if (!empresaId || !id) return;
    try {
      setLoadingData(true);
      const tipo = await tarefaTipoService.getById(parseInt(empresaId), parseInt(id));
      reset({
        nome: tipo.nome,
        gerenteFuncionarioId: tipo.gerenteFuncionarioId || undefined,
        centroCustoId: tipo.centroCustoId || undefined,
        cor: tipo.cor || '#3B82F6',
        ativo: tipo.ativo,
      });
    } catch (error) {
      console.error('Erro ao carregar tipo de tarefa:', error);
      toast.error('Erro ao carregar tipo de tarefa');
      navigate(`/empresas/${empresaId}/tipos-tarefa`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const tipoData: Partial<TarefaTipo> = {
        ...data,
        empresaId: parseInt(empresaId),
      };

      if (id) {
        await tarefaTipoService.update(parseInt(empresaId), parseInt(id), tipoData);
        toast.success('Tipo de tarefa atualizado com sucesso');
      } else {
        await tarefaTipoService.create(parseInt(empresaId), tipoData as TarefaTipo);
        toast.success('Tipo de tarefa criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/tipos-tarefa`);
    } catch (error: any) {
      console.error('Erro ao salvar tipo de tarefa:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar tipo de tarefa');
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
          {id ? 'Editar Tipo de Tarefa' : 'Novo Tipo de Tarefa'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              {...register('nome')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Nome do tipo de tarefa"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gerente Responsável
              </label>
              <select
                {...register('gerenteFuncionarioId')}
                className="select"
                disabled={loading}
              >
                <option value="">Selecione um gerente</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.funcionarioId} value={funcionario.funcionarioId}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
              {errors.gerenteFuncionarioId && (
                <p className="text-red-500 text-sm mt-1">{errors.gerenteFuncionarioId.message}</p>
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
                Cor
              </label>
              <input
                type="color"
                {...register('cor')}
                className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.cor && (
                <p className="text-red-500 text-sm mt-1">{errors.cor.message}</p>
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
                Tipo Ativo
              </label>
            </div>
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
              onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa`)}
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
