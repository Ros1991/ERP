import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import tarefaFuncionarioStatusService from '@/services/tarefa/tarefaFuncionarioStatus.service';
import funcionarioService, { PaginatedResponse } from '@/services/funcionario/funcionario.service';
import { CreateTarefaFuncionarioStatusDTO } from '@/models/tarefa/TarefaFuncionarioStatus.model';
import { Funcionario } from '@/models/funcionario/Funcionario.model';

const schema = yup.object({
  funcionarioId: yup.number().required('Funcionário é obrigatório'),
  status: yup.string().oneOf(
    ['ATRIBUIDA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA'],
    'Status inválido'
  ).optional(),
  observacao: yup.string().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TarefaFuncionarioStatusForm() {
  const { empresaId, tarefaId, statusId } = useParams<{ 
    empresaId: string; 
    tarefaId: string; 
    statusId?: string 
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const isEdit = !!statusId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'ATRIBUIDA'
    }
  });

  useEffect(() => {
    if (empresaId) {
      loadFuncionarios();
      if (isEdit && statusId) {
        loadStatus();
      }
    }
  }, [empresaId, statusId, isEdit]);

  const loadFuncionarios = async () => {
    try {
      const response: PaginatedResponse<Funcionario> = await funcionarioService.getAll(
        Number(empresaId),
        1,
        100 // Load up to 100 funcionarios for selection
      );
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Error loading funcionarios:', error);
      toast.error('Erro ao carregar funcionários');
    }
  };

  const loadStatus = async () => {
    try {
      setLoading(true);
      const status = await tarefaFuncionarioStatusService.getById(
        Number(empresaId),
        Number(statusId)
      );
      reset({
        funcionarioId: status.funcionarioId,
        status: status.status,
        observacao: status.observacao
      });
    } catch (error) {
      console.error('Error loading status:', error);
      toast.error('Erro ao carregar status');
      navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        await tarefaFuncionarioStatusService.update(
          Number(empresaId),
          Number(statusId),
          {
            status: data.status,
            observacao: data.observacao
          }
        );
        toast.success('Status atualizado com sucesso');
      } else {
        const dto: CreateTarefaFuncionarioStatusDTO = {
          empresaId: Number(empresaId),
          tarefaId: Number(tarefaId),
          funcionarioId: data.funcionarioId,
          status: data.status,
          observacao: data.observacao
        };
        await tarefaFuncionarioStatusService.create(Number(empresaId), dto);
        toast.success('Funcionário atribuído com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status`);
    } catch (error: any) {
      console.error('Error saving status:', error);
      if (error.response?.data?.message?.includes('already exists')) {
        toast.error('Este funcionário já está atribuído a esta tarefa');
      } else {
        toast.error(isEdit ? 'Erro ao atualizar status' : 'Erro ao atribuir funcionário');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Status do Funcionário' : 'Atribuir Funcionário à Tarefa'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funcionário *
              </label>
              <select
                {...register('funcionarioId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || isEdit}
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map((func) => (
                  <option key={func.funcionarioId} value={func.funcionarioId}>
                    {func.nome} - {func.cpf}
                  </option>
                ))}
              </select>
              {errors.funcionarioId && (
                <p className="text-red-500 text-sm mt-1">{errors.funcionarioId.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="ATRIBUIDA">Atribuída</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="PAUSADA">Pausada</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observação
            </label>
            <textarea
              {...register('observacao')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Adicione observações sobre o status do funcionário nesta tarefa..."
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
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Atribuir'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status`)}
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
