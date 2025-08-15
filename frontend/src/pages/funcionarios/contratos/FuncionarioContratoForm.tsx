import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { funcionarioContratoService } from '../../../services/funcionario/funcionarioContrato.service';
import type { CreateFuncionarioContratoDTO, FuncionarioContrato } from '../../../models/funcionario/Funcionario.model';

const schema = yup.object({
  tipoContrato: yup.string().oneOf(['CLT', 'PJ', 'ESTAGIARIO', 'TERCEIRIZADO']).required('Tipo de contrato é obrigatório'),
  tipoPagamento: yup.string().oneOf(['HORISTA', 'DIARISTA', 'MENSALISTA']).required('Tipo de pagamento é obrigatório'),
  formaPagamento: yup.string().nullable(),
  salario: yup.number().required('Salário é obrigatório').positive('Salário deve ser positivo'),
  cargaHorariaSemanal: yup.number().nullable().positive('Carga horária deve ser positiva'),
  dataInicio: yup.string().required('Data de início é obrigatória'),
  dataFim: yup.string().nullable(),
  observacoes: yup.string().nullable(),
  ativo: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

export function FuncionarioContratoForm() {
  const navigate = useNavigate();
  const { companyId, funcionarioId, contratoId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const isEdit = !!contratoId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ativo: true,
      tipoContrato: 'CLT',
      tipoPagamento: 'MENSALISTA',
    },
  });

  const dataFim = watch('dataFim');
  const dataInicio = watch('dataInicio');

  useEffect(() => {
    if (isEdit && contratoId) {
      loadContrato();
    }
  }, [contratoId]);

  const loadContrato = async () => {
    setLoadingData(true);
    try {
      const contrato = await funcionarioContratoService.getById(companyId!, funcionarioId!, contratoId!);
      reset({
        tipoContrato: contrato.tipoContrato,
        tipoPagamento: contrato.tipoPagamento,
        formaPagamento: contrato.formaPagamento || '',
        salario: contrato.salario,
        cargaHorariaSemanal: contrato.cargaHorariaSemanal || undefined,
        dataInicio: contrato.dataInicio,
        dataFim: contrato.dataFim || '',
        observacoes: contrato.observacoes || '',
        ativo: contrato.ativo,
      });
    } catch (error) {
      console.error('Erro ao carregar contrato:', error);
      toast.error('Erro ao carregar dados do contrato');
      navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate date logic
    if (data.dataFim && data.dataInicio && new Date(data.dataFim) < new Date(data.dataInicio)) {
      toast.error('Data de fim não pode ser anterior à data de início');
      return;
    }

    setLoading(true);
    try {
      const contratoData: CreateFuncionarioContratoDTO = {
        funcionarioId: parseInt(funcionarioId!),
        tipoContrato: data.tipoContrato as 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TERCEIRIZADO',
        tipoPagamento: data.tipoPagamento as 'HORISTA' | 'DIARISTA' | 'MENSALISTA',
        formaPagamento: data.formaPagamento || undefined,
        salario: data.salario,
        cargaHorariaSemanal: data.cargaHorariaSemanal || undefined,
        dataInicio: data.dataInicio,
        dataFim: data.dataFim || undefined,
        observacoes: data.observacoes || undefined,
        ativo: data.ativo,
      };

      if (isEdit) {
        await funcionarioContratoService.update(companyId!, funcionarioId!, contratoId!, contratoData);
        toast.success('Contrato atualizado com sucesso!');
      } else {
        await funcionarioContratoService.create(companyId!, funcionarioId!, contratoData);
        toast.success('Contrato cadastrado com sucesso!');
      }
      navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`);
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      toast.error('Erro ao salvar contrato');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para contratos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Contrato' : 'Novo Contrato'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Contrato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Contrato *
              </label>
              <select
                {...register('tipoContrato')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="CLT">CLT</option>
                <option value="PJ">Pessoa Jurídica</option>
                <option value="ESTAGIARIO">Estagiário</option>
                <option value="TERCEIRIZADO">Terceirizado</option>
              </select>
              {errors.tipoContrato && (
                <p className="mt-1 text-sm text-red-600">{errors.tipoContrato.message}</p>
              )}
            </div>

            {/* Tipo de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pagamento *
              </label>
              <select
                {...register('tipoPagamento')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="HORISTA">Horista</option>
                <option value="DIARISTA">Diarista</option>
                <option value="MENSALISTA">Mensalista</option>
              </select>
              {errors.tipoPagamento && (
                <p className="mt-1 text-sm text-red-600">{errors.tipoPagamento.message}</p>
              )}
            </div>

            {/* Salário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salário *
              </label>
              <Input
                {...register('salario')}
                type="number"
                step="0.01"
                error={errors.salario?.message}
                placeholder="0.00"
              />
            </div>

            {/* Carga Horária */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carga Horária Semanal
              </label>
              <Input
                {...register('cargaHorariaSemanal')}
                type="number"
                error={errors.cargaHorariaSemanal?.message}
                placeholder="40"
              />
            </div>

            {/* Forma de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <Input
                {...register('formaPagamento')}
                error={errors.formaPagamento?.message}
                placeholder="Ex: Transferência bancária, PIX"
              />
            </div>

            {/* Data Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <Input
                {...register('dataInicio')}
                type="date"
                error={errors.dataInicio?.message}
              />
            </div>

            {/* Data Fim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fim
              </label>
              <Input
                {...register('dataFim')}
                type="date"
                error={errors.dataFim?.message}
                min={dataInicio}
              />
            </div>

            {/* Observações */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                {...register('observacoes')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Informações adicionais sobre o contrato"
              />
              {errors.observacoes && (
                <p className="mt-1 text-sm text-red-600">{errors.observacoes.message}</p>
              )}
            </div>

            {/* Status */}
            {isEdit && (
              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('ativo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Contrato ativo
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Atualizar' : 'Cadastrar'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
