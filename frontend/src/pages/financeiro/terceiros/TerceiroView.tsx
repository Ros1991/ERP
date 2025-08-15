import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, User, Building, Users, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import terceiroService from '../../../services/financeiro/terceiro.service';
import type { Terceiro } from '../../../models/financeiro/Terceiro.model';

export default function TerceiroView() {
  const { empresaId, terceiroId } = useParams<{ empresaId: string; terceiroId: string }>();
  const navigate = useNavigate();
  const [terceiro, setTerceiro] = useState<Terceiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId && terceiroId) {
      loadTerceiro();
    }
  }, [empresaId, terceiroId]);

  const loadTerceiro = async () => {
    try {
      setLoading(true);
      const data = await terceiroService.getById(Number(empresaId), Number(terceiroId));
      setTerceiro(data);
    } catch (error) {
      console.error('Error loading terceiro:', error);
      toast.error('Erro ao carregar terceiro');
      navigate(`/empresas/${empresaId}/terceiros`);
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'CLIENTE': return <User className="h-6 w-6" />;
      case 'FORNECEDOR': return <Building className="h-6 w-6" />;
      case 'AMBOS': return <Users className="h-6 w-6" />;
      default: return <User className="h-6 w-6" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'CLIENTE': return 'bg-blue-100 text-blue-800';
      case 'FORNECEDOR': return 'bg-orange-100 text-orange-800';
      case 'AMBOS': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDocument = (doc: string, tipo: string) => {
    if (tipo === 'FISICA') {
      // Format CPF: 000.000.000-00
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // Format CNPJ: 00.000.000/0000-00
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
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

  if (!terceiro) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Terceiro não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Terceiro</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/empresas/${empresaId}/terceiros`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/empresas/${empresaId}/terceiros/${terceiroId}/editar`)}
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
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getTipoColor(terceiro.tipo)}`}>
                {getTipoIcon(terceiro.tipo)}
                {terceiro.tipo}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                terceiro.tipoPessoa === 'FISICA' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'
              }`}>
                {terceiro.tipoPessoa === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                terceiro.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {terceiro.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nome</h3>
              <p className="text-lg font-semibold text-gray-900">{terceiro.nome}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {terceiro.tipoPessoa === 'FISICA' ? 'CPF' : 'CNPJ'}
              </h3>
              <p className="text-lg font-mono text-gray-900">
                {formatDocument(terceiro.documento, terceiro.tipoPessoa)}
              </p>
            </div>
          </div>

          {/* Informações de contato */}
          {(terceiro.email || terceiro.telefone || terceiro.endereco) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terceiro.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="text-gray-900">{terceiro.email}</p>
                    </div>
                  </div>
                )}

                {terceiro.telefone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-500">Telefone:</span>
                      <p className="text-gray-900">{terceiro.telefone}</p>
                    </div>
                  </div>
                )}

                {terceiro.endereco && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <span className="text-sm text-gray-500">Endereço:</span>
                      <p className="text-gray-900">{terceiro.endereco}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {terceiro.observacao && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{terceiro.observacao}</p>
            </div>
          )}

          {/* Informações de auditoria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Registro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {formatDate(terceiro.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Atualizado em: {formatDateTime(terceiro.updatedAt)}</span>
              </div>
              {terceiro.isDeleted && terceiro.deletedAt && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <Clock className="h-4 w-4" />
                  <span>Excluído em: {formatDateTime(terceiro.deletedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
