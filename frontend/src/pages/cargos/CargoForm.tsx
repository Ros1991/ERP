import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { roleService } from '../../services/auth/auth.service';
import type { Role } from '../../models/auth/Role.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  ativo: yup.boolean().required(),
  permissoes: yup.object().nullable(),
});

type FormData = yup.InferType<typeof schema>;

const CargoForm: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ativo: true,
      permissoes: {},
    },
  });

  useEffect(() => {
    if (id) {
      loadCargo();
    }
  }, [id]);

  const loadCargo = async () => {
    if (!empresaId || !id) return;

    try {
      setLoadingData(true);
      const cargo = await roleService.getById(parseInt(empresaId), parseInt(id));
      reset({
        nome: cargo.nome,
        ativo: cargo.ativo,
        permissoes: cargo.permissoes || {},
      });
    } catch (error) {
      console.error('Erro ao carregar cargo:', error);
      toast.error('Erro ao carregar cargo');
      navigate(`/empresas/${empresaId}/cargos`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const cargoData: Partial<Role> = {
        ...data,
        empresaId: parseInt(empresaId),
      };

      if (id) {
        await roleService.update(parseInt(empresaId), parseInt(id), cargoData);
        toast.success('Cargo atualizado com sucesso');
      } else {
        await roleService.create(parseInt(empresaId), cargoData as Role);
        toast.success('Cargo criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/cargos`);
    } catch (error: any) {
      console.error('Erro ao salvar cargo:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar cargo');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/cargos`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Editar Cargo' : 'Novo Cargo'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Atualize as informações do cargo' : 'Preencha os dados para criar um novo cargo'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cargo *
              </label>
              <input
                type="text"
                {...register('nome')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Administrador, Gerente, Operador"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('ativo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              {errors.ativo && (
                <p className="mt-1 text-sm text-red-600">{errors.ativo.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/cargos`)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargoForm;
