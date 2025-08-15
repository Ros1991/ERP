import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, DollarSign, Building2, User, Wallet, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import contaService from '../../../services/financeiro/conta.service';
import type { Conta } from '../../../models/financeiro/Conta.model';

export default function ContaView() {
  const { empresaId, contaId } = useParams<{ empresaId: string; contaId: string }>();
  const navigate = useNavigate();
  const [conta, setConta] = useState<Conta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && contaId) {
      loadConta();
    }
  }, [empresaId, contaId]);

  const loadConta = async () => {
    try {
      setLoading(true);
      const data = await contaService.getById(Number(empresaId), Number(contaId));
      setConta(data);
    } catch (error) {
      console.error('Error loading conta:', error);
      toast.error('Erro ao carregar conta');
      navigate(`/empresas/${empresaId}/contas`);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'SOCIO': return <User className="h-6 w-6" />;
      case 'EMPRESA': return <Building2 className="h-6 w-6" />;
      case 'BANCO': return <DollarSign className="h-6 w-6" />;
      case 'CAIXA': return <Wallet className="h-6 w-6" />;
      default: return <DollarSign className="h-6 w-6" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'SOCIO': return 'bg-purple-100 text-purple-800';
      case 'EMPRESA': return 'bg-blue-100 text-blue-800';
      case 'BANCO': return 'bg-green-100 text-green-800';
      case 'CAIXA': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!conta) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Conta não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Conta</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/contas`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/contas/${contaId}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-5 w-5" />
            Editar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Header com tipo e status */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getTipoColor(conta.tipo)}`}>
                {getTipoIcon(conta.tipo)}
                {conta.tipo}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                conta.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {conta.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nome da Conta</h3>
              <p className="text-lg font-semibold text-gray-900">{conta.nome}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Saldo Atual</h3>
              <p className={`text-2xl font-bold ${conta.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(conta.saldo)}
              </p>
            </div>

            {conta.socioId && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">ID do Sócio</h3>
                <p className="text-lg text-gray-900">#{conta.socioId}</p>
              </div>
            )}

            {conta.bancoId && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">ID do Banco</h3>
                <p className="text-lg text-gray-900">#{conta.bancoId}</p>
              </div>
            )}
          </div>

          {/* Informações de auditoria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Criada em: {formatDate(conta.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Atualizada em: {formatDateTime(conta.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
