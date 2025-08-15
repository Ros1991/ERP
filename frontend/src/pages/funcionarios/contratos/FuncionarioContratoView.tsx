import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit2, 
  Loader2,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { funcionarioContratoService } from '../../../services/funcionario/funcionarioContrato.service';
import type { FuncionarioContrato } from '../../../models/funcionario/Funcionario.model';

export function FuncionarioContratoView() {
  const navigate = useNavigate();
  const { companyId, funcionarioId, contratoId } = useParams();
  const [contrato, setContrato] = useState<FuncionarioContrato | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContrato();
  }, [contratoId]);

  const loadContrato = async () => {
    setLoading(true);
    try {
      const data = await funcionarioContratoService.getById(companyId!, funcionarioId!, contratoId!);
      setContrato(data);
    } catch (error) {
      console.error('Erro ao carregar contrato:', error);
      toast.error('Erro ao carregar dados do contrato');
      navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTipoContratoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'CLT': 'CLT',
      'PJ': 'Pessoa Jurídica',
      'ESTAGIARIO': 'Estagiário',
      'TERCEIRIZADO': 'Terceirizado'
    };
    return labels[tipo] || tipo;
  };

  const getTipoPagamentoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'HORISTA': 'Horista',
      'DIARISTA': 'Diarista',
      'MENSALISTA': 'Mensalista'
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Contrato não encontrado</p>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`)}
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
          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para contratos
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contrato {getTipoContratoLabel(contrato.tipoContrato)}
            </h1>
            <p className="text-gray-600">ID: {contrato.contratoId}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/editar`)}
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
              contrato.ativo 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {contrato.ativo ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Contrato Ativo
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Contrato Inativo
                </>
              )}
            </span>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados do Contrato */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Contrato</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de Contrato</p>
                    <p className="text-sm text-gray-900">{getTipoContratoLabel(contrato.tipoContrato)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de Pagamento</p>
                    <p className="text-sm text-gray-900">{getTipoPagamentoLabel(contrato.tipoPagamento)}</p>
                  </div>
                </div>

                {contrato.formaPagamento && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Forma de Pagamento</p>
                      <p className="text-sm text-gray-900">{contrato.formaPagamento}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salário</p>
                    <p className="text-sm text-gray-900 font-semibold">{formatCurrency(contrato.salario)}</p>
                  </div>
                </div>

                {contrato.cargaHorariaSemanal && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Carga Horária Semanal</p>
                      <p className="text-sm text-gray-900">{contrato.cargaHorariaSemanal} horas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vigência */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vigência</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data de Início</p>
                    <p className="text-sm text-gray-900">{formatDate(contrato.dataInicio)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Data de Fim</p>
                    <p className="text-sm text-gray-900">{formatDate(contrato.dataFim)}</p>
                  </div>
                </div>

                {contrato.dataInicio && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900">
                      {contrato.dataFim ? 
                        `Contrato com prazo determinado` :
                        `Contrato por prazo indeterminado`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Observações */}
            {contrato.observacoes && (
              <div className="col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações</h2>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{contrato.observacoes}</p>
                </div>
              </div>
            )}

            {/* Sistema */}
            <div className="col-span-2 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">ID do Contrato</p>
                  <p className="text-sm text-gray-900">{contrato.contratoId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ID do Funcionário</p>
                  <p className="text-sm text-gray-900">{contrato.funcionarioId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Criado em</p>
                  <p className="text-sm text-gray-900">{formatDate(contrato.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Atualizado em</p>
                  <p className="text-sm text-gray-900">{formatDate(contrato.updatedAt)}</p>
                </div>
                {contrato.deletedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Excluído em</p>
                    <p className="text-sm text-gray-900">{formatDate(contrato.deletedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Data */}
          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Relacionados</h2>
            <Button
              variant="secondary"
              onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios`)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerenciar Benefícios/Descontos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
