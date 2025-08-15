import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import tarefaTipoService from '@/services/tarefa/tarefaTipo.service';
import { CreateTarefaTipoDTO } from '@/models/tarefa/TarefaTipo.model';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório').max(255, 'Nome deve ter no máximo 255 caracteres'),
  gerenteFuncionarioId: yup.number().nullable().optional().transform((value) => (value === '' ? null : value)),
  centroCustoId: yup.number().nullable().optional().transform((value) => (value === '' ? null : value)),
  cor: yup.string().nullable().optional()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)')
    .transform((value) => (value === '' ? null : value)),
  ativo: yup.boolean().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TarefaTipoForm() {
  const { empresaId, tipoId } = useParams<{ empresaId: string; tipoId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!tipoId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ativo: true
    }
  });

  useEffect(() => {
    if (isEdit && tipoId) {
      loadTarefaTipo();
    }
  }, [isEdit, tipoId]);

  const loadTarefaTipo = async () => {
    try {
      setLoading(true);
      const data = await tarefaTipoService.getById(Number(empresaId), Number(tipoId));
      setValue('nome', data.nome);
      setValue('gerenteFuncionarioId', data.gerenteFuncionarioId || null);
      setValue('centroCustoId', data.centroCustoId || null);
      setValue('cor', data.cor || '');
      setValue('ativo', data.ativo);
    } catch (error) {
      console.error('Error loading task type:', error);
      toast.error('Erro ao carregar tipo de tarefa');
      navigate(`/empresas/${empresaId}/tarefa-tipos`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const dto: CreateTarefaTipoDTO = {
        empresaId: Number(empresaId),
        nome: data.nome,
        gerenteFuncionarioId: data.gerenteFuncionarioId || undefined,
        centroCustoId: data.centroCustoId || undefined,
        cor: data.cor || undefined,
        ativo: data.ativo
      };

      if (isEdit) {
        await tarefaTipoService.update(Number(empresaId), Number(tipoId), dto);
        toast.success('Tipo de tarefa atualizado com sucesso');
      } else {
        await tarefaTipoService.create(Number(empresaId), dto);
        toast.success('Tipo de tarefa criado com sucesso');
      }

      navigate(`/empresas/${empresaId}/tarefa-tipos`);
    } catch (error) {
      console.error('Error saving task type:', error);
      toast.error(`Erro ao ${isEdit ? 'atualizar' : 'criar'} tipo de tarefa`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar' : 'Novo'} Tipo de Tarefa
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome *
            </label>
            <input
              {...register('nome')}
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
              Cor (Hexadecimal)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                {...register('cor')}
                type="text"
                placeholder="#FF0000"
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="color"
                onChange={(e) => setValue('cor', e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                disabled={loading}
              />
            </div>
            {errors.cor && (
              <p className="mt-1 text-sm text-red-600">{errors.cor.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="gerenteFuncionarioId" className="block text-sm font-medium text-gray-700">
              ID do Funcionário Gerente
            </label>
            <input
              {...register('gerenteFuncionarioId')}
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.gerenteFuncionarioId && (
              <p className="mt-1 text-sm text-red-600">{errors.gerenteFuncionarioId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="centroCustoId" className="block text-sm font-medium text-gray-700">
              ID do Centro de Custo
            </label>
            <input
              {...register('centroCustoId')}
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.centroCustoId && (
              <p className="mt-1 text-sm text-red-600">{errors.centroCustoId.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register('ativo')}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
              Ativo
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos`)}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
