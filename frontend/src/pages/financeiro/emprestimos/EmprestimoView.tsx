import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emprestimoService } from '../../../services/financeiro/emprestimo.service';
import type { Emprestimo } from '../../../models/financeiro/Emprestimo.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, User, DollarSign, Calendar, FileText, Loader2 } from 'lucide-react';

const EmprestimoView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [emprestimo, setEmprestimo] = useState<Emprestimo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmprestimo();
  }, [empresaId, id]);

  const loadEmprestimo = async () => {
    if (!empresaId || !id) return;
    try {
      setLoading(true);
      const data = await emprestimoService.getById(parseInt(empresaId), parseInt(id));
      setEmprestimo(data);
    } catch (error) {
      console.error('Erro ao carregar empréstimo:', error);
      toast.error('Erro ao carregar empréstimo');
      navigate(`/empresas/${empresaId}/emprestimos`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'ATIVO': 'bg-blue-100 text-blue-800',
      'QUITADO': 'bg-green-100 text-green-800',
      'VENCIDO': 'bg-red-100 text-red-800',
      'CANCELADO': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando empréstimo...</span>
        </div>
      </div>
    );
  }

  if (!emprestimo) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Empréstimo não encontrado</div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(`/empresas/${empresaId}/emprestimos`)} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para lista
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Detalhes do Empréstimo</h1>
          <button onClick={() => navigate(`/empresas/${empresaId}/emprestimos/${id}/editar`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <span className="font-medium text-gray-700">Funcionário:</span>
              <span className="ml-2 text-lg">{emprestimo.funcionario?.nome || '-'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Valor Total:</span>
                <span className="ml-2 text-lg font-semibold text-green-600">
                  R$ {emprestimo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Valor da Parcela:</span>
                <span className="ml-2">
                  R$ {(emprestimo.valorTotal / emprestimo.totalParcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="font-medium text-gray-700">Quantidade de Parcelas:</span>
              <span className="ml-2">{emprestimo.totalParcelas}x</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <div className="mt-1">{getStatusBadge(emprestimo.status)}</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-3 text-gray-400" />
            <div>
              <span className="font-medium text-gray-700">Data do Empréstimo:</span>
              <span className="ml-2">
                {new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {emprestimo.observacoes && (
            <div className="flex items-start text-gray-600">
              <FileText className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Observações:</span>
                <p className="ml-0 mt-1 text-gray-600">{emprestimo.observacoes}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <span className="ml-2">
                  {new Date(emprestimo.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700">Última atualização:</span>
                <span className="ml-2">
                  {new Date(emprestimo.updatedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmprestimoView;
