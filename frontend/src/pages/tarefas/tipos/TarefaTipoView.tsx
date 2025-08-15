import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import tarefaTipoService from '@/services/tarefa/tarefaTipo.service';
import { TarefaTipo } from '@/models/tarefa/TarefaTipo.model';

export default function TarefaTipoView() {
  const { empresaId, tipoId } = useParams<{ empresaId: string; tipoId: string }>();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<TarefaTipo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && tipoId) {
      loadTarefaTipo();
    }
  }, [empresaId, tipoId]);

  const loadTarefaTipo = async () => {
    try {
      setLoading(true);
      const data = await tarefaTipoService.getById(Number(empresaId), Number(tipoId));
      setTipo(data);
    } catch (error) {
      console.error('Error loading task type:', error);
      toast.error('Erro ao carregar tipo de tarefa');
      navigate(`/empresas/${empresaId}/tarefa-tipos`);
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
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Tipo de Tarefa</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/tarefa-tipos/${tipoId}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="h-5 w-5" />
            Editar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Informações Gerais</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">ID</label>
              <p className="mt-1 text-gray-900">{tipo.tipoId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  tipo.ativo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tipo.ativo ? (
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Nome</label>
              <p className="mt-1 text-gray-900 font-medium">{tipo.nome}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Cor</label>
              {tipo.cor ? (
                <div className="mt-1 flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: tipo.cor }}
                  />
                  <span className="text-gray-900">{tipo.cor}</span>
                </div>
              ) : (
                <p className="mt-1 text-gray-400">Não definida</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Funcionário Gerente</label>
              {tipo.gerenteFuncionarioId ? (
                <p className="mt-1 text-gray-900">ID: {tipo.gerenteFuncionarioId}</p>
              ) : (
                <p className="mt-1 text-gray-400">Não definido</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Centro de Custo</label>
              {tipo.centroCustoId ? (
                <p className="mt-1 text-gray-900">ID: {tipo.centroCustoId}</p>
              ) : (
                <p className="mt-1 text-gray-400">Não definido</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Informações do Sistema</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Data de Criação</label>
              <p className="mt-1 text-gray-900">
                {new Date(tipo.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Última Atualização</label>
              <p className="mt-1 text-gray-900">
                {new Date(tipo.updatedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
