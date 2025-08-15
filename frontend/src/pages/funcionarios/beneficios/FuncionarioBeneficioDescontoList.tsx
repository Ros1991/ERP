import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign,
  Gift,
  MinusCircle,
  FileText
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { funcionarioBeneficioDescontoService } from '../../../services/funcionario/funcionarioBeneficioDesconto.service';
import type { FuncionarioBeneficioDesconto } from '../../../models/funcionario/Funcionario.model';

export function FuncionarioBeneficioDescontoList() {
  const navigate = useNavigate();
  const { companyId, funcionarioId, contratoId } = useParams();
  const [items, setItems] = useState<FuncionarioBeneficioDesconto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [contratoId]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await funcionarioBeneficioDescontoService.getAllByContrato(companyId!, funcionarioId!, contratoId!);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar benefícios/descontos:', error);
      toast.error('Erro ao carregar benefícios e descontos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (beneficioDescontoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }
    
    try {
      await funcionarioBeneficioDescontoService.delete(companyId!, funcionarioId!, contratoId!, String(beneficioDescontoId));
      toast.success('Item excluído com sucesso!');
      loadItems();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const beneficios = items.filter(item => item.tipo === 'BENEFICIO');
  const descontos = items.filter(item => item.tipo === 'DESCONTO');

  return (
    <div className="p-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">Benefícios e Descontos</h1>
            <p className="text-gray-600">Contrato #{contratoId}</p>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios/novo`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum benefício ou desconto cadastrado
          </h3>
          <p className="text-gray-600 mb-4">
            Adicione benefícios ou descontos ao contrato
          </p>
          <Button
            onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios/novo`)}
            className="mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Benefícios Section */}
          {beneficios.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Benefícios
              </h2>
              <div className="grid gap-3">
                {beneficios.map((item) => (
                  <div
                    key={item.beneficioDescontoId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.descricao}</h3>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Valor:</span>
                            {item.valorFixo ? (
                              <span className="font-medium text-green-600">
                                {formatCurrency(item.valorFixo)}
                              </span>
                            ) : (
                              <span className="font-medium text-green-600">
                                {formatPercentage(item.percentual!)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios/${item.beneficioDescontoId}/editar`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.beneficioDescontoId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descontos Section */}
          {descontos.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MinusCircle className="h-5 w-5 text-red-600" />
                Descontos
              </h2>
              <div className="grid gap-3">
                {descontos.map((item) => (
                  <div
                    key={item.beneficioDescontoId}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.descricao}</h3>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Valor:</span>
                            {item.valorFixo ? (
                              <span className="font-medium text-red-600">
                                -{formatCurrency(item.valorFixo)}
                              </span>
                            ) : (
                              <span className="font-medium text-red-600">
                                -{formatPercentage(item.percentual!)}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/dashboard/${companyId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios/${item.beneficioDescontoId}/editar`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.beneficioDescontoId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
