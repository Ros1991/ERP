import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit2, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  FileText,
  Hash,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';

export function FuncionarioView() {
  const navigate = useNavigate();
  const { companyId, funcionarioId } = useParams();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFuncionario();
  }, [funcionarioId]);

  const loadFuncionario = async () => {
    setLoading(true);
    try {
      const data = await funcionarioService.getById(companyId!, funcionarioId!);
      setFuncionario(data);
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      toast.error('Erro ao carregar dados do funcionário');
      navigate(`/dashboard/${companyId}/funcionarios`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string | undefined) => {
    if (!cpf) return '-';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!funcionario) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Funcionário não encontrado</p>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios`)}
            className="mt-4"
          >
            Voltar para lista
          </Button>
        </div>
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
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {funcionario.nome || funcionario.apelido}
            </h1>
            {funcionario.nome && funcionario.apelido !== funcionario.nome && (
              <p className="text-gray-600">Conhecido como: {funcionario.apelido}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/editar`)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              funcionario.ativo 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {funcionario.ativo ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Funcionário Ativo
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Funcionário Inativo
                </>
              )}
            </span>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nome Completo</p>
                    <p className="text-sm text-gray-900">{funcionario.nome || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">CPF</p>
                    <p className="text-sm text-gray-900">{formatCPF(funcionario.cpf)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">RG</p>
                    <p className="text-sm text-gray-900">{funcionario.rg || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data de Nascimento</p>
                    <p className="text-sm text-gray-900">{formatDate(funcionario.dataNascimento)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contato</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">E-mail</p>
                    <p className="text-sm text-gray-900">{funcionario.email || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telefone</p>
                    <p className="text-sm text-gray-900">{funcionario.telefone || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Endereço</p>
                    <p className="text-sm text-gray-900">{funcionario.endereco || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sistema */}
            <div className="col-span-2 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">ID do Funcionário</p>
                  <p className="text-sm text-gray-900">{funcionario.funcionarioId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ID da Empresa</p>
                  <p className="text-sm text-gray-900">{funcionario.empresaId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ID Usuário Empresa</p>
                  <p className="text-sm text-gray-900">{funcionario.usuarioEmpresaId || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Criado em</p>
                  <p className="text-sm text-gray-900">{formatDate(funcionario.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Atualizado em</p>
                  <p className="text-sm text-gray-900">{formatDate(funcionario.updatedAt)}</p>
                </div>
                {funcionario.deletedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Excluído em</p>
                    <p className="text-sm text-gray-900">{formatDate(funcionario.deletedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Data Sections */}
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`)}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerenciar Contratos
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/beneficios`)}
                className="justify-start"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerenciar Benefícios/Descontos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
