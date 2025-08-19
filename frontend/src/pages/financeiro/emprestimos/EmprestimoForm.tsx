import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { emprestimoService } from '../../../services/financeiro/emprestimo.service';
import { funcionarioService } from '../../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../../models/funcionario/Funcionario.model';

const schema = yup.object({
  funcionarioId: yup.number().required('Funcionário é obrigatório'),
  valorTotal: yup.number().required('Valor total é obrigatório').positive('Valor deve ser positivo'),
  totalParcelas: yup.number().required('Total de parcelas é obrigatório').positive().integer(),
  quandoCobrar: yup.string().required('Quando cobrar é obrigatório').oneOf(['MENSAL', 'FERIAS', '13_SALARIO', 'TUDO']),
  dataEmprestimo: yup.string().required('Data do empréstimo é obrigatória'),
  dataInicioCobranca: yup.string().required('Data início cobrança é obrigatória'),
  status: yup.string().required('Status é obrigatório').oneOf(['ATIVO', 'QUITADO', 'CANCELADO']),
  observacoes: yup.string().optional()
}).required();

type FormData = yup.InferType<typeof schema>;

export default function EmprestimoForm() {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'ATIVO',
      quandoCobrar: 'MENSAL',
      dataEmprestimo: new Date().toISOString().split('T')[0],
      dataInicioCobranca: new Date().toISOString().split('T')[0],
    }
  });


  useEffect(() => {
    if (empresaId) {
      loadFuncionarios();
      if (id) loadEmprestimo();
    }
  }, [empresaId, id]);

  const loadFuncionarios = async () => {
    if (!empresaId) return;
    try {
      const response = await funcionarioService.getAll(parseInt(empresaId), 1, 1000);
      setFuncionarios(response.data.filter((f: Funcionario) => f.ativo));
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const loadEmprestimo = async () => {
    if (!empresaId || !id) return;
    try {
      setLoadingData(true);
      const emprestimo = await emprestimoService.getById(parseInt(empresaId), parseInt(id));
      reset({
        funcionarioId: emprestimo.funcionarioId,
        valorTotal: emprestimo.valorTotal,
        totalParcelas: emprestimo.totalParcelas,
        quandoCobrar: emprestimo.quandoCobrar,
        dataEmprestimo: new Date(emprestimo.dataEmprestimo).toISOString().split('T')[0],
        dataInicioCobranca: new Date(emprestimo.dataInicioCobranca).toISOString().split('T')[0],
        status: emprestimo.status,
        observacoes: emprestimo.observacoes || '',
      });
    } catch (error) {
      console.error('Erro ao carregar empréstimo:', error);
      toast.error('Erro ao carregar empréstimo');
      navigate(`/empresas/${empresaId}/emprestimos`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!empresaId) return;
    try {
      setLoading(true);
      const payload = {
        funcionarioId: data.funcionarioId,
        empresaId: parseInt(empresaId),
        valorTotal: data.valorTotal,
        totalParcelas: data.totalParcelas,
        quandoCobrar: data.quandoCobrar as 'MENSAL' | 'FERIAS' | '13_SALARIO' | 'TUDO',
        dataEmprestimo: data.dataEmprestimo,
        dataInicioCobranca: data.dataInicioCobranca,
        status: data.status as 'ATIVO' | 'QUITADO' | 'CANCELADO',
        observacoes: data.observacoes || '',
      };

      if (id) {
        await emprestimoService.update(parseInt(empresaId), parseInt(id), payload);
        toast.success('Empréstimo atualizado com sucesso');
      } else {
        await emprestimoService.create(parseInt(empresaId), payload);
        toast.success('Empréstimo criado com sucesso');
      }
      navigate(`/empresas/${empresaId}/emprestimos`);
    } catch (error: any) {
      console.error('Erro ao salvar empréstimo:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar empréstimo');
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
          {id ? 'Editar Empréstimo' : 'Novo Empréstimo'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funcionário *
            </label>
            <select
              {...register('funcionarioId')}
              className="select"
              disabled={loading}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario.funcionarioId} value={funcionario.funcionarioId}>
                  {funcionario.nome}
                </option>
              ))}
            </select>
            {errors.funcionarioId && (
              <p className="text-red-500 text-sm mt-1">{errors.funcionarioId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valorTotal')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="0,00"
              />
              {errors.valorTotal && (
                <p className="text-red-500 text-sm mt-1">{errors.valorTotal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade de Parcelas *
              </label>
              <input
                type="number"
                {...register('totalParcelas')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="1"
              />
              {errors.totalParcelas && (
                <p className="text-red-500 text-sm mt-1">{errors.totalParcelas.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quando Cobrar *
              </label>
              <select
                {...register('quandoCobrar')}
                className="select"
                disabled={loading}
              >
                <option value="MENSAL">Mensal</option>
                <option value="FERIAS">Férias</option>
                <option value="13_SALARIO">13º Salário</option>
                <option value="TUDO">Tudo</option>
              </select>
              {errors.quandoCobrar && (
                <p className="text-red-500 text-sm mt-1">{errors.quandoCobrar.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data do Empréstimo *
              </label>
              <input
                type="date"
                {...register('dataEmprestimo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.dataEmprestimo && (
                <p className="text-red-500 text-sm mt-1">{errors.dataEmprestimo.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Início Cobrança *
              </label>
              <input
                type="date"
                {...register('dataInicioCobranca')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {errors.dataInicioCobranca && (
                <p className="text-red-500 text-sm mt-1">{errors.dataInicioCobranca.message}</p>
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
                <option value="ATIVO">Ativo</option>
                <option value="QUITADO">Quitado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              {...register('observacoes')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading}
              placeholder="Observações sobre o empréstimo..."
            />
            {errors.observacoes && (
              <p className="text-red-500 text-sm mt-1">{errors.observacoes.message}</p>
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
              onClick={() => navigate(`/empresas/${empresaId}/emprestimos`)}
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
