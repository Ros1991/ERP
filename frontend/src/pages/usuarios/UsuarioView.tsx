import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/auth/auth.service';
import type { User } from '../../models/auth/User.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Mail, User as UserIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UsuarioView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsuario();
  }, [id]);

  const loadUsuario = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await userService.getById(parseInt(id));
      setUsuario(data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      toast.error('Erro ao carregar usuário');
      navigate(`/empresas/${empresaId}/usuarios`);
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

  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Usuário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/usuarios`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Usuário</h1>
            <p className="text-gray-600">Informações completas do usuário</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/empresas/${empresaId}/usuarios/${id}/editar`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-5 w-5" />
          Editar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{usuario.nome}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{usuario.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Data de Criação</label>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {format(new Date(usuario.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Última Atualização</label>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">
                  {format(new Date(usuario.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioView;
