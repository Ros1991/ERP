import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Building2, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import centroCustoService from '../../../services/financeiro/centroCusto.service';
import type { CentroCusto } from '../../../models/financeiro/CentroCusto.model';

export default function CentroCustoView() {
  const { empresaId, centroCustoId } = useParams<{ empresaId: string; centroCustoId: string }>();
  const navigate = useNavigate();
  const [centroCusto, setCentroCusto] = useState<CentroCusto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && centroCustoId) {
      loadCentroCusto();
    }
  }, [empresaId, centroCustoId]);

  const loadCentroCusto = async () => {
    try {
      setLoading(true);
      const data = await centroCustoService.getById(Number(empresaId), Number(centroCustoId));
      setCentroCusto(data);
    } catch (error) {
      console.error('Error loading centro de custo:', error);
      toast.error('Erro ao carregar centro de custo');
      navigate(`/empresas/${empresaId}/centros-custo`);
    } finally {
      setLoading(false);
    }
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

  if (!centroCusto) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Centro de custo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Centro de Custo</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/centros-custo`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/centros-custo/${centroCustoId}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-5 w-5" />
            Editar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Building2 className="h-10 w-10 text-blue-600" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{centroCusto.nome}</h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                centroCusto.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {centroCusto.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* Descrição */}
          {centroCusto.descricao && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Descrição</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{centroCusto.descricao}</p>
              </div>
            </div>
          )}

          {/* Informações de auditoria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Criado em: {formatDateTime(centroCusto.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Atualizado em: {formatDateTime(centroCusto.updatedAt)}</span>
              </div>
              {centroCusto.isDeleted && centroCusto.deletedAt && (
                <div className="flex items-center gap-2 text-sm text-red-600 md:col-span-2">
                  <Clock className="h-4 w-4" />
                  <span>Excluído em: {formatDateTime(centroCusto.deletedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
