import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { CreateFuncionarioDTO, UpdateFuncionarioDTO, Funcionario } from '../../models/funcionario/Funcionario.model';

const schema = yup.object({
  apelido: yup.string().required('Apelido é obrigatório'),
  nome: yup.string().nullable(),
  cpf: yup.string()
    .nullable()
    .transform((value) => value === '' ? null : value)
    .matches(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  rg: yup.string().nullable(),
  dataNascimento: yup.string().nullable(),
  endereco: yup.string().nullable(),
  telefone: yup.string().nullable(),
  email: yup.string().email('Email inválido').nullable(),
  usuarioEmpresaId: yup.number().nullable(),
  ativo: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

export function FuncionarioForm() {
  const navigate = useNavigate();
  const { companyId, funcionarioId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const isEdit = !!funcionarioId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ativo: true,
    },
  });

  useEffect(() => {
    if (isEdit && funcionarioId) {
      loadFuncionario();
    }
  }, [funcionarioId]);

  const loadFuncionario = async () => {
    setLoadingData(true);
    try {
      const funcionario = await funcionarioService.getById(companyId!, funcionarioId!);
      reset({
        apelido: funcionario.apelido,
        nome: funcionario.nome || '',
        cpf: funcionario.cpf || '',
        rg: funcionario.rg || '',
        dataNascimento: funcionario.dataNascimento || '',
        endereco: funcionario.endereco || '',
        telefone: funcionario.telefone || '',
        email: funcionario.email || '',
        usuarioEmpresaId: funcionario.usuarioEmpresaId || undefined,
        ativo: funcionario.ativo,
      });
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      toast.error('Erro ao carregar dados do funcionário');
      navigate(`/dashboard/${companyId}/funcionarios`);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        const updateData: UpdateFuncionarioDTO = {
          ...data,
          empresaId: parseInt(companyId!),
        };
        await funcionarioService.update(companyId!, funcionarioId!, updateData);
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        const createData: CreateFuncionarioDTO = {
          ...data,
          empresaId: parseInt(companyId!),
        };
        await funcionarioService.create(companyId!, createData);
        toast.success('Funcionário cadastrado com sucesso!');
      }
      navigate(`/dashboard/${companyId}/funcionarios`);
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error('Erro ao salvar funcionário');
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
          onClick={() => navigate(`/dashboard/${companyId}/funcionarios`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Funcionário' : 'Novo Funcionário'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apelido *
              </label>
              <Input
                {...register('apelido')}
                error={errors.apelido?.message}
                placeholder="Como o funcionário é conhecido"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <Input
                {...register('nome')}
                error={errors.nome?.message}
                placeholder="Nome completo do funcionário"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <Input
                {...register('cpf')}
                error={errors.cpf?.message}
                placeholder="00000000000"
                maxLength={11}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RG
              </label>
              <Input
                {...register('rg')}
                error={errors.rg?.message}
                placeholder="Documento de identidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <Input
                {...register('dataNascimento')}
                type="date"
                error={errors.dataNascimento?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Usuário Empresa
              </label>
              <Input
                {...register('usuarioEmpresaId')}
                type="number"
                error={errors.usuarioEmpresaId?.message}
                placeholder="ID do usuário vinculado"
              />
            </div>

            {/* Contato */}
            <div className="col-span-2 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contato</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <Input
                {...register('email')}
                type="email"
                error={errors.email?.message}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <Input
                {...register('telefone')}
                error={errors.telefone?.message}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <Input
                {...register('endereco')}
                error={errors.endereco?.message}
                placeholder="Endereço completo"
              />
            </div>

            {/* Status */}
            {isEdit && (
              <div className="col-span-2 mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('ativo')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Funcionário ativo
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
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios`)}
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
