import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { funcionarioContratoService } from '../../../services/funcionario/funcionarioContrato.service';
import type { FuncionarioContrato } from '../../../models/funcionario/Funcionario.model';

export function FuncionarioContratoList() {
  const navigate = useNavigate();
  const { companyId, funcionarioId } = useParams();
  const [contratos, setContratos] = useState<FuncionarioContrato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContratos();
  }, [funcionarioId]);

  const loadContratos = async () => {
    setLoading(true);
    try {
      const data = await funcionarioContratoService.getAllByFuncionario(companyId!, funcionarioId!);
      setContratos(data);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contratoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este contrato?')) {
      return;
    }
    
    try {
      await funcionarioContratoService.delete(companyId!, funcionarioId!, String(contratoId));
      toast.success('Contrato excluído com sucesso!');
      loadContratos();
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
      toast.error('Erro ao excluir contrato');
    }
  };

  const handleToggleActive = async (contratoId: number) => {
    try {
      await funcionarioContratoService.toggleActive(companyId!, funcionarioId!, String(contratoId));
      toast.success('Status do contrato alterado com sucesso!');
      loadContratos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do contrato');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para funcionário
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos do Funcionário</h1>
            <p className="text-gray-600">Gerencie os contratos de trabalho</p>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/novo`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : contratos.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum contrato cadastrado
          </h3>
          <p className="text-gray-600 mb-4">
            Cadastre o primeiro contrato deste funcionário
          </p>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/novo`)}
            className="mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Contrato
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {contratos.map((contrato) => (
            <div
              key={contrato.contratoId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getTipoContratoLabel(contrato.tipoContrato)}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      contrato.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contrato.ativo ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Inativo
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">Salário:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(contrato.salario)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {getTipoPagamentoLabel(contrato.tipoPagamento)}
                        </span>
                      </div>
                    </div>
                    
                    {contrato.cargaHorariaSemanal && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">Carga horária:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {contrato.cargaHorariaSemanal}h/semana
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">Início:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatDate(contrato.dataInicio)}
                        </span>
                      </div>
                    </div>
                    
                    {contrato.dataFim && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">Fim:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {formatDate(contrato.dataFim)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {contrato.formaPagamento && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-gray-600">Forma:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {contrato.formaPagamento}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {contrato.observacoes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Observações:</span> {contrato.observacoes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contrato.contratoId}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contrato.contratoId}/editar`)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(contrato.contratoId)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                    title={contrato.ativo ? "Desativar" : "Ativar"}
                  >
                    {contrato.ativo ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(contrato.contratoId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Benefícios/Descontos Link */}
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contrato.contratoId}/beneficios`)}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  Gerenciar Benefícios/Descontos
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
