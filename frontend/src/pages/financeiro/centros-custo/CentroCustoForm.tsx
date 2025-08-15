import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import centroCustoService from '../../../services/financeiro/centroCusto.service';
import type { CreateCentroCustoDTO, UpdateCentroCustoDTO } from '../../../models/financeiro/CentroCusto.model';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  descricao: yup.string(),
  ativo: yup.boolean()
});

type FormData = yup.InferType<typeof schema>;

export default function CentroCustoForm() {
  const { empresaId, centroCustoId } = useParams<{ empresaId: string; centroCustoId?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEdit = !!centroCustoId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: '',
      descricao: '',
      ativo: true
    }
  });

  useEffect(() => {
    if (isEdit && empresaId && centroCustoId) {
      loadCentroCusto();
    }
  }, [isEdit, empresaId, centroCustoId]);

  const loadCentroCusto = async () => {
    try {
      setLoading(true);
      const data = await centroCustoService.getById(Number(empresaId), Number(centroCustoId));
      reset({
        nome: data.nome,
        descricao: data.descricao || '',
        ativo: data.ativo
      });
    } catch (error) {
      console.error('Error loading centro de custo:', error);
      toast.error('Erro ao carregar centro de custo');
      navigate(`/empresas/${empresaId}/centros-custo`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (isEdit) {
        const updateData: UpdateCentroCustoDTO = {
          nome: data.nome,
          descricao: data.descricao || undefined,
          ativo: data.ativo
        };
        await centroCustoService.update(Number(empresaId), Number(centroCustoId), updateData);
        toast.success('Centro de custo atualizado com sucesso');
      } else {
        const createData: CreateCentroCustoDTO = {
          empresaId: Number(empresaId),
          nome: data.nome,
          descricao: data.descricao || undefined,
          ativo: data.ativo
        };
        await centroCustoService.create(Number(empresaId), createData);
        toast.success('Centro de custo criado com sucesso');
      }
      
      navigate(`/empresas/${empresaId}/centros-custo`);
    } catch (error) {
      console.error('Error saving centro de custo:', error);
      toast.error('Erro ao salvar centro de custo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
        </h1>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/centros-custo`)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                type="text"
                {...register('nome')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Administração, Vendas, TI"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...register('descricao')}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição detalhada do centro de custo"
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('ativo')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Centro de Custo Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/centros-custo`)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
