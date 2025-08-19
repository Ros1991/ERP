import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  apelido: yup.string().required('Apelido é obrigatório'),
  cpf: yup.string().optional(),
  rg: yup.string().optional(),
  dataNascimento: yup.date().optional(),
  endereco: yup.string().optional(),
  telefone: yup.string().optional(),
  email: yup.string().email('Email inválido').optional(),
  ativo: yup.boolean().required('Status é obrigatório'),
});

interface FormData {
  nome: string;
  apelido: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: Date;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
}

const FuncionarioForm: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      nome: '',
      apelido: '',
      cpf: undefined,
      rg: undefined,
      dataNascimento: undefined,
      endereco: undefined,
      telefone: undefined,
      email: undefined,
      ativo: true
    }
  });

  useEffect(() => {
    if (id) {
      loadFuncionario();
    }
  }, [id]);

  const loadFuncionario = async () => {
    if (!empresaId || !id) return;

    try {
      setLoadingData(true);
      const funcionario = await funcionarioService.getById(parseInt(empresaId), parseInt(id));
      reset({
        nome: funcionario?.nome || '',
        apelido: funcionario?.apelido || '',
        cpf: funcionario?.cpf || undefined,
        rg: funcionario?.rg || undefined,
        dataNascimento: funcionario?.dataNascimento ? new Date(funcionario.dataNascimento) : undefined,
        endereco: funcionario?.endereco || undefined,
        telefone: funcionario?.telefone || undefined,
        email: funcionario?.email || undefined,
        ativo: funcionario?.ativo ?? true
      });
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      toast.error('Erro ao carregar funcionário');
      navigate(`/empresas/${empresaId}/funcionarios`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const funcionarioData = {
        nome: data.nome,
        apelido: data.apelido,
        cpf: data.cpf || undefined,
        rg: data.rg || undefined,
        dataNascimento: data.dataNascimento || undefined,
        endereco: data.endereco || undefined,
        telefone: data.telefone || undefined,
        email: data.email || undefined,
        ativo: data.ativo,
        empresaId: parseInt(empresaId),
      };

      if (id) {
        await funcionarioService.update(parseInt(empresaId), parseInt(id), funcionarioData);
        toast.success('Funcionário atualizado com sucesso');
      } else {
        await funcionarioService.create(parseInt(empresaId), funcionarioData as Funcionario);
        toast.success('Funcionário criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/funcionarios`);
    } catch (error: any) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar funcionário');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/empresas/${empresaId}/funcionarios`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para lista
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                {...register('nome')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo do funcionário"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apelido *
              </label>
              <input
                type="text"
                {...register('apelido')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apelido do funcionário"
              />
              {errors.apelido && (
                <p className="mt-1 text-sm text-red-600">{errors.apelido.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                {...register('cpf')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RG
              </label>
              <input
                type="text"
                {...register('rg')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="RG do funcionário"
              />
              {errors.rg && (
                <p className="mt-1 text-sm text-red-600">{errors.rg.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                {...register('dataNascimento')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dataNascimento && (
                <p className="mt-1 text-sm text-red-600">{errors.dataNascimento.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="text"
                {...register('telefone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('ativo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              {errors.ativo && (
                <p className="mt-1 text-sm text-red-600">{errors.ativo.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <textarea
              {...register('endereco')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Endereço completo"
            />
            {errors.endereco && (
              <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/empresas/${empresaId}/funcionarios`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuncionarioForm;
