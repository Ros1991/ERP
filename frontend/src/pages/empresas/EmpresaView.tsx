import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { empresaService } from '../../services/empresa/empresa.service';
import type { Empresa } from '../../models/empresa/Empresa.model';
import { cn } from '../../utils/cn';

export function EmpresaView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEmpresa(id);
    }
  }, [id]);

  const loadEmpresa = async (empresaId: string) => {
    try {
      setLoading(true);
      const data = await empresaService.getById(empresaId);
      setEmpresa(data);
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      navigate('/empresas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/empresas')}
            variant="ghost"
            icon={<ArrowLeft className="h-5 w-5" />}
          >
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {empresa.nome}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Detalhes da empresa
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/empresas/${empresa.id}/editar`)}
          icon={<Edit className="h-5 w-5" />}
        >
          Editar
        </Button>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Status da Empresa
          </h2>
          <span className={cn(
            'inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full',
            empresa.ativo
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {empresa.ativo ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Ativa
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Inativa
              </>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Informações Básicas
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CNPJ</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {empresa.cnpj || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">E-mail</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {empresa.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {empresa.telefone || 'Não informado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Endereço
            </h3>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                {empresa.endereco ? (
                  <>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {empresa.endereco}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {[empresa.cidade, empresa.estado].filter(Boolean).join(', ')}
                    </p>
                    {empresa.cep && (
                      <p className="text-gray-600 dark:text-gray-400">
                        CEP: {empresa.cep}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Endereço não informado
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informações do Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Criado em</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(empresa.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Última atualização</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(empresa.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
