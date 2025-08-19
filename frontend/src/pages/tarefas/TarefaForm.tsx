import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import tarefaService from '../../services/tarefa/tarefa.service';
import tarefaTipoService from '../../services/tarefa/tarefaTipo.service';
import type { Tarefa } from '../../models/tarefa/Tarefa.model';
import type { TarefaTipo } from '../../models/tarefa/TarefaTipo.model';

const schema = yup.object({
  titulo: yup.string().required('Título é obrigatório'),
  descricao: yup.string().optional(),
  tipoId: yup.number().required('Tipo é obrigatório'),
  status: yup.string().required('Status é obrigatório'),
  prioridade: yup.string().required('Prioridade é obrigatória'),
  dataInicio: yup.string().optional(),
  dataPrazo: yup.string().optional(),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TarefaForm() {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [tipos, setTipos] = useState<TarefaTipo[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'PENDENTE',
      prioridade: 'MEDIA'
    }
  });

  useEffect(() => {
    if (empresaId) {
      loadTipos();
      if (id) loadTarefa();
    }
  }, [empresaId, id]);

  const loadTipos = async () => {
    if (!empresaId) return;
    try {
      const response = await tarefaTipoService.getAll(parseInt(empresaId));
      setTipos(response);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    }
  };

  const loadTarefa = async () => {
    if (!empresaId || !id) return;
    try {
      setLoadingData(true);
      const tarefa = await tarefaService.getById(parseInt(empresaId), parseInt(id));
      reset({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || '',
        tipoId: tarefa.tipoId,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataInicio: tarefa.dataInicio ? new Date(tarefa.dataInicio).toISOString().split('T')[0] : '',
        dataPrazo: tarefa.dataPrazo ? new Date(tarefa.dataPrazo).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      toast.error('Erro ao carregar tarefa');
      navigate(`/empresas/${empresaId}/tarefas`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const tarefaData: Partial<Tarefa> = {
        ...data,
        empresaId: parseInt(empresaId),
      };

      if (id) {
        await tarefaService.update(parseInt(empresaId), parseInt(id), tarefaData);
        toast.success('Tarefa atualizada com sucesso');
      } else {
        await tarefaService.create(parseInt(empresaId), tarefaData as Tarefa);
        toast.success('Tarefa criada com sucesso');
      }
      navigate(`/empresas/${empresaId}/tarefas`);
    } catch (error: any) {
      console.error('Erro ao salvar tarefa:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar tarefa');
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
          {id ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              {...register('titulo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Título da tarefa"
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
              placeholder="Descrição detalhada da tarefa"
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                {...register('tipoId')}
                className="select"
                disabled={loading}
              >
                <option value="">Selecione um tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.tipoId} value={tipo.tipoId}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
              {errors.tipoId && (
                <p className="text-red-500 text-sm mt-1">{errors.tipoId.message}</p>
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
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="PAUSADA">Pausada</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade *
              </label>
              <select
                {...register('prioridade')}
                className="select"
                disabled={loading}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
              {errors.prioridade && (
                <p className="text-red-500 text-sm mt-1">{errors.prioridade.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                {...register('dataInicio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.dataInicio && (
                <p className="text-red-500 text-sm mt-1">{errors.dataInicio.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Prazo
            </label>
            <input
              type="date"
              {...register('dataPrazo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.dataPrazo && (
              <p className="text-red-500 text-sm mt-1">{errors.dataPrazo.message}</p>
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
              onClick={() => navigate(`/empresas/${empresaId}/tarefas`)}
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
