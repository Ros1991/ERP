import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import tarefaTipoService from '../../services/tarefa/tarefaTipo.service';
import type { TarefaTipo } from '../../models/tarefa/TarefaTipo.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Tag, User, Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TarefaTipoView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [tipo, setTipo] = useState<TarefaTipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTarefaTipo();
  }, [empresaId, id]);

  const loadTarefaTipo = async () => {
    if (!empresaId || !id) return;
    try {
      setLoading(true);
      const data = await tarefaTipoService.getById(parseInt(empresaId), parseInt(id));
      setTipo(data);
    } catch (error) {
      console.error('Erro ao carregar tipo de tarefa:', error);
      toast.error('Erro ao carregar tipo de tarefa');
      navigate(`/empresas/${empresaId}/tipos-tarefa`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tipo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Tipo de tarefa não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Tipo de Tarefa</h1>
            <p className="text-gray-600">Visualize as informações do tipo de tarefa</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/tipos-tarefa/${id}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-5 w-5" />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">{tipo.nome}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-gray-200" 
                    style={{ backgroundColor: tipo.cor || '#6B7280' }}
                  />
                  <span className="text-gray-900 font-mono">{tipo.cor || '#6B7280'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center">
                  {tipo.ativo ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Inativo
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gerente Responsável</label>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {tipo.gerenteFuncionarioId ? `ID: ${tipo.gerenteFuncionarioId}` : 'Não definido'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Centro de Custo</label>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {tipo.centroCustoId ? `ID: ${tipo.centroCustoId}` : 'Não definido'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {format(new Date(tipo.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Atualizado em: {format(new Date(tipo.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarefaTipoView;
