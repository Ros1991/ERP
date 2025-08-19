import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { roleService } from '../../services/auth/auth.service';
import type { Role } from '../../models/auth/Role.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CargoView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [cargo, setCargo] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCargo();
  }, [empresaId, id]);

  const loadCargo = async () => {
    if (!empresaId || !id) return;

    try {
      setLoading(true);
      const data = await roleService.getById(parseInt(empresaId), parseInt(id));
      setCargo(data);
    } catch (error) {
      console.error('Erro ao carregar cargo:', error);
      toast.error('Erro ao carregar cargo');
      navigate(`/empresas/${empresaId}/cargos`);
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

  if (!cargo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/cargos`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Cargo</h1>
            <p className="text-gray-600">Visualize as informações do cargo</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/cargos/${id}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-5 w-5" />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nome do Cargo</p>
              <p className="text-lg font-semibold text-gray-900">{cargo.nome}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-5 w-5 flex items-center justify-center">
              <div className={`h-3 w-3 rounded-full ${cargo.ativo ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                cargo.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {cargo.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Criado em</p>
              <p className="text-sm text-gray-900">
                {format(new Date(cargo.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Última atualização</p>
              <p className="text-sm text-gray-900">
                {format(new Date(cargo.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoView;
