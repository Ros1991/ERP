import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import tarefaService from '@/services/tarefa/tarefa.service';
import tarefaTipoService from '@/services/tarefa/tarefaTipo.service';
import { CreateTarefaDTO } from '@/models/tarefa/Tarefa.model';
import { TarefaTipo } from '@/models/tarefa/TarefaTipo.model';

const schema = yup.object({
  titulo: yup.string().required('Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres'),
  descricao: yup.string().optional(),
  tipoId: yup.number().nullable().optional().transform((value) => (value === '' ? null : value)),
  status: yup.string().oneOf(
    ['PENDENTE', 'EM_ANDAMENTO', 'PAUSADA', 'PARADA', 'CONCLUIDA', 'CANCELADA'],
    'Status inválido'
  ).optional(),
  prioridade: yup.string().oneOf(
    ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'],
    'Prioridade inválida'
  ).optional(),
  dataInicio: yup.string().nullable().optional(),
  dataPrazo: yup.string().nullable().optional(),
  dataConclusao: yup.string().nullable().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TarefaForm() {
  const { empresaId, tarefaId } = useParams<{ empresaId: string; tarefaId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tipos, setTipos] = useState<TarefaTipo[]>([]);
  const isEdit = !!tarefaId;

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
      if (isEdit && tarefaId) {
        loadTarefa();
      }
    }
  }, [empresaId, tarefaId, isEdit]);

  const loadTipos = async () => {
    try {
      const data = await tarefaTipoService.getAll(Number(empresaId));
      setTipos(data);
    } catch (error) {
      console.error('Error loading task types:', error);
      toast.error('Erro ao carregar tipos de tarefa');
    }
  };

  const loadTarefa = async () => {
    try {
      setLoading(true);
      const tarefa = await tarefaService.getById(Number(empresaId), Number(tarefaId));
      reset({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        tipoId: tarefa.tipoId,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataInicio: tarefa.dataInicio ? tarefa.dataInicio.split('T')[0] : undefined,
        dataPrazo: tarefa.dataPrazo ? tarefa.dataPrazo.split('T')[0] : undefined,
        dataConclusao: tarefa.dataConclusao ? tarefa.dataConclusao.split('T')[0] : undefined
      });
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Erro ao carregar tarefa');
      navigate(`/empresas/${empresaId}/tarefas`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const dto: CreateTarefaDTO = {
        empresaId: Number(empresaId),
        titulo: data.titulo,
        descricao: data.descricao,
        tipoId: data.tipoId || undefined,
        status: data.status,
        prioridade: data.prioridade,
        dataInicio: data.dataInicio || undefined,
        dataPrazo: data.dataPrazo || undefined,
        dataConclusao: data.dataConclusao || undefined
      };

      if (isEdit) {
        await tarefaService.update(Number(empresaId), Number(tarefaId), dto);
        toast.success('Tarefa atualizada com sucesso');
      } else {
        await tarefaService.create(Number(empresaId), dto);
        toast.success('Tarefa criada com sucesso');
      }
      navigate(`/empresas/${empresaId}/tarefas`);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(isEdit ? 'Erro ao atualizar tarefa' : 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                {...register('titulo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.titulo && (
                <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Tarefa
              </label>
              <select
                {...register('tipoId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Selecione um tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.tipoId} value={tipo.tipoId}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>

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
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="PAUSADA">Pausada</option>
                <option value="PARADA">Parada</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                {...register('prioridade')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
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
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Conclusão
                </label>
                <input
                  type="date"
                  {...register('dataConclusao')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              {...register('descricao')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
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
