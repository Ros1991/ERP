import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, TrendingUp, TrendingDown, Calendar, DollarSign, Clock, FileText, Building, User } from 'lucide-react';
import toast from 'react-hot-toast';
import transacaoFinanceiraService from '../../../services/financeiro/transacaoFinanceira.service';
import contaService from '../../../services/financeiro/conta.service';
import terceiroService from '../../../services/financeiro/terceiro.service';
import type { TransacaoFinanceira } from '../../../models/financeiro/TransacaoFinanceira.model';
import type { Conta } from '../../../models/financeiro/Conta.model';
import type { Terceiro } from '../../../models/financeiro/Terceiro.model';

export default function TransacaoFinanceiraView() {
  const { empresaId, transacaoFinanceiraId } = useParams<{ empresaId: string; transacaoFinanceiraId: string }>();
  const navigate = useNavigate();
  const [transacao, setTransacao] = useState<TransacaoFinanceira | null>(null);
  const [conta, setConta] = useState<Conta | null>(null);
  const [terceiro, setTerceiro] = useState<Terceiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && transacaoFinanceiraId) {
      loadTransacao();
    }
  }, [empresaId, transacaoFinanceiraId]);

  const loadTransacao = async () => {
    try {
      setLoading(true);
      const data = await transacaoFinanceiraService.getById(Number(empresaId), Number(transacaoFinanceiraId));
      setTransacao(data);
      
      // Load conta details
      if (data.contaId) {
        try {
          const contaData = await contaService.getById(Number(empresaId), data.contaId);
          setConta(contaData);
        } catch (error) {
          console.error('Error loading conta:', error);
        }
      }
      
      // Load terceiro details if exists
      if (data.terceiroId) {
        try {
          const terceiroData = await terceiroService.getById(Number(empresaId), data.terceiroId);
          setTerceiro(terceiroData);
        } catch (error) {
          console.error('Error loading terceiro:', error);
        }
      }
    } catch (error) {
      console.error('Error loading transação:', error);
      toast.error('Erro ao carregar transação financeira');
      navigate(`/empresas/${empresaId}/transacoes-financeiras`);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'RECEITA' ? 
      <TrendingUp className="h-8 w-8 text-green-600" /> : 
      <TrendingDown className="h-8 w-8 text-red-600" />;
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600';
  };

  const getTipoBadgeColor = (tipo: string) => {
    return tipo === 'RECEITA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!transacao) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Transação financeira não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Transação Financeira</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/transacoes-financeiras/${transacaoFinanceiraId}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-5 w-5" />
            Editar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Header com tipo e valor */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {getTipoIcon(transacao.tipo)}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{transacao.descricao}</h2>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTipoBadgeColor(transacao.tipo)}`}>
                  {transacao.tipo}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Valor</p>
              <p className={`text-3xl font-bold ${getTipoColor(transacao.tipo)}`}>
                {formatCurrency(transacao.valor)}
              </p>
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Conta</h3>
              {conta ? (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{conta.nome}</p>
                    <p className="text-sm text-gray-600">{conta.tipo}</p>
                    {conta.bancoId && <p className="text-sm text-gray-600">{conta.bancoId}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-lg text-gray-900">ID: {transacao.contaId}</p>
              )}
            </div>

            {terceiro && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {transacao.tipo === 'RECEITA' ? 'Cliente' : 'Fornecedor'}
                </h3>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{terceiro.nome}</p>
                    <p className="text-sm text-gray-600">{terceiro.documento}</p>
                    {terceiro.email && <p className="text-sm text-gray-600">{terceiro.email}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <span className="text-sm text-gray-500">Data da Transação:</span>
              <p className="text-gray-900 font-medium">{formatDate(transacao.data)}</p>
            </div>
          </div>

          {/* Observações */}
          {transacao.observacao && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Observações</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{transacao.observacao}</p>
              </div>
            </div>
          )}

          {/* Informações de auditoria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Criado em: {formatDateTime(transacao.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Atualizado em: {formatDateTime(transacao.updatedAt)}</span>
              </div>
              {transacao.isDeleted && transacao.deletedAt && (
                <div className="flex items-center gap-2 text-sm text-red-600 md:col-span-2">
                  <Clock className="h-4 w-4" />
                  <span>Excluído em: {formatDateTime(transacao.deletedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
