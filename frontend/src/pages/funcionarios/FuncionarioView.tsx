import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { funcionarioService } from '../../services/funcionario/funcionario.service';
import type { Funcionario } from '../../models/funcionario/Funcionario.model';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Calendar, Mail, Phone, MapPin, User, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FuncionarioView: React.FC = () => {
  const navigate = useNavigate();
  const { empresaId, id } = useParams<{ empresaId: string; id: string }>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFuncionario();
  }, [empresaId, id]);

  const loadFuncionario = async () => {
    if (!empresaId || !id) return;

    try {
      setLoading(true);
      const data = await funcionarioService.getById(parseInt(empresaId), parseInt(id));
      setFuncionario(data);
    } catch (error) {
      console.error('Erro ao carregar funcionário:', error);
      toast.error('Erro ao carregar funcionário');
      navigate(`/empresas/${empresaId}/funcionarios`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!funcionario) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Funcionário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/empresas/${empresaId}/funcionarios`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para lista
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Detalhes do Funcionário</h1>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/funcionarios/${id}/editar`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="h-5 w-5" />
            <span>Editar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Informações Pessoais</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">Nome:</span>
                  <span className="ml-2">{funcionario.nome || '-'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">Apelido:</span>
                  <span className="ml-2">{funcionario.apelido}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="font-medium">CPF:</span>
                  <span className="ml-2">{funcionario.cpf || '-'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="font-medium">RG:</span>
                  <span className="ml-2">{funcionario.rg || '-'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="font-medium">Data de Nascimento:</span>
                  <span className="ml-2">
                    {funcionario.dataNascimento
                      ? format(new Date(funcionario.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Informações de Contato</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{funcionario.email || '-'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span className="font-medium">Telefone:</span>
                  <span className="ml-2">{funcionario.telefone || '-'}</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 mt-1" />
                  <div>
                    <span className="font-medium">Endereço:</span>
                    <p className="ml-2">{funcionario.endereco || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Status</h3>
              <div className="flex items-center">
                {funcionario.ativo ? (
                  <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                    Ativo
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
                    Inativo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Criado em: {format(new Date(funcionario.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            <p>Última atualização: {format(new Date(funcionario.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncionarioView;
