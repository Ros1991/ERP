import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { funcionarioBeneficioDescontoService } from '../../../services/funcionario/funcionarioBeneficioDesconto.service';
import type { CreateFuncionarioBeneficioDescontoDTO } from '../../../models/funcionario/Funcionario.model';

const schema = yup.object({
  tipo: yup.string().oneOf(['BENEFICIO', 'DESCONTO']).required('Tipo é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  valorFixo: yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .positive('Valor deve ser positivo')
    .test('valor-ou-percentual', 'Informe valor fixo ou percentual', function(value) {
      const { percentual } = this.parent;
      return (value !== null && value !== undefined) || (percentual !== null && percentual !== undefined);
    }),
  percentual: yup.number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .min(0, 'Percentual deve ser maior ou igual a 0')
    .max(100, 'Percentual deve ser menor ou igual a 100'),
});

type FormData = yup.InferType<typeof schema>;

export function FuncionarioBeneficioDescontoForm() {
  const navigate = useNavigate();
  const { companyId, funcionarioId, contratoId, beneficioDescontoId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [tipoValor, setTipoValor] = useState<'fixo' | 'percentual'>('fixo');
  const isEdit = !!beneficioDescontoId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: 'BENEFICIO',
    },
  });

  const tipo = watch('tipo');
  const valorFixo = watch('valorFixo');
  const percentual = watch('percentual');

  useEffect(() => {
    if (isEdit && beneficioDescontoId) {
      loadItem();
    }
  }, [beneficioDescontoId]);

  useEffect(() => {
    if (tipoValor === 'fixo') {
      setValue('percentual', null);
    } else {
      setValue('valorFixo', null);
    }
  }, [tipoValor, setValue]);

  const loadItem = async () => {
    setLoadingData(true);
    try {
      const item = await funcionarioBeneficioDescontoService.getById(
        companyId!, 
        funcionarioId!, 
        contratoId!, 
        beneficioDescontoId!
      );
      
      reset({
        tipo: item.tipo,
        descricao: item.descricao,
        valorFixo: item.valorFixo || undefined,
        percentual: item.percentual || undefined,
      });
      
      setTipoValor(item.valorFixo ? 'fixo' : 'percentual');
    } catch (error) {
      console.error('Erro ao carregar item:', error);
      toast.error('Erro ao carregar dados');
      navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const itemData: CreateFuncionarioBeneficioDescontoDTO = {
        contratoId: parseInt(contratoId!),
        tipo: data.tipo as 'BENEFICIO' | 'DESCONTO',
        descricao: data.descricao,
        valorFixo: tipoValor === 'fixo' ? data.valorFixo : undefined,
        percentual: tipoValor === 'percentual' ? data.percentual : undefined,
      };

      if (isEdit) {
        await funcionarioBeneficioDescontoService.update(
          companyId!, 
          funcionarioId!, 
          contratoId!, 
          beneficioDescontoId!, 
          itemData
        );
        toast.success('Item atualizado com sucesso!');
      } else {
        await funcionarioBeneficioDescontoService.create(
          companyId!, 
          funcionarioId!, 
          contratoId!, 
          itemData
        );
        toast.success('Item cadastrado com sucesso!');
      }
      navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios`);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar item');
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
          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar' : 'Novo'} {tipo === 'BENEFICIO' ? 'Benefício' : 'Desconto'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                {...register('tipo')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BENEFICIO">Benefício</option>
                <option value="DESCONTO">Desconto</option>
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Input
                {...register('descricao')}
                error={errors.descricao?.message}
                placeholder={tipo === 'BENEFICIO' ? 'Ex: Vale alimentação' : 'Ex: INSS'}
              />
            </div>

            {/* Tipo de Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Valor *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="fixo"
                    checked={tipoValor === 'fixo'}
                    onChange={(e) => setTipoValor('fixo')}
                    className="mr-2"
                  />
                  <span className="text-sm">Valor Fixo (R$)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="percentual"
                    checked={tipoValor === 'percentual'}
                    onChange={(e) => setTipoValor('percentual')}
                    className="mr-2"
                  />
                  <span className="text-sm">Percentual (%)</span>
                </label>
              </div>
            </div>

            {/* Valor */}
            {tipoValor === 'fixo' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Fixo (R$) *
                </label>
                <Input
                  {...register('valorFixo')}
                  type="number"
                  step="0.01"
                  error={errors.valorFixo?.message}
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentual (%) *
                </label>
                <Input
                  {...register('percentual')}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  error={errors.percentual?.message}
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Info Box */}
            <div className={`p-4 rounded-md ${tipo === 'BENEFICIO' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm ${tipo === 'BENEFICIO' ? 'text-green-800' : 'text-red-800'}`}>
                {tipo === 'BENEFICIO' ? (
                  <>
                    <strong>Benefício:</strong> Valor adicional ao salário do funcionário.
                    {tipoValor === 'percentual' && ' O percentual será calculado sobre o salário base do contrato.'}
                  </>
                ) : (
                  <>
                    <strong>Desconto:</strong> Valor descontado do salário do funcionário.
                    {tipoValor === 'percentual' && ' O percentual será calculado sobre o salário base do contrato.'}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios`)}
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
