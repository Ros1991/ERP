import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../../services/auth/auth.service';
import type { User } from '../../models/auth/User.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';

const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().when('$isEdit', {
    is: false,
    then: (schema) => schema.required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
    otherwise: (schema) => schema.optional()
  })
});

type FormData = {
  nome: string;
  email: string;
  password?: string;
};

const UsuarioForm: React.FC = () => {
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
      nome: '',
      email: '',
      password: ''
    },
    context: { isEdit: !!id },
  });

  useEffect(() => {
    if (id) {
      loadUsuario();
    }
  }, [id]);

  const loadUsuario = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const usuario = await userService.getById(parseInt(id));
      reset({
        nome: usuario.nome,
        email: usuario.email,
      });
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      toast.error('Erro ao carregar usuário');
      navigate(`/empresas/${empresaId}/usuarios`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (id) {
        await userService.update(parseInt(id), data);
        toast.success('Usuário atualizado com sucesso');
      } else {
        await userService.create(data as User);
        toast.success('Usuário criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/usuarios`);
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário');
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
            onClick={() => navigate(`/empresas/${empresaId}/usuarios`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Editar Usuário' : 'Novo Usuário'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Atualize as informações do usuário' : 'Preencha os dados para criar um novo usuário'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                {...register('nome')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome completo"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {!id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-md"
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/usuarios`)}
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

export default UsuarioForm;
