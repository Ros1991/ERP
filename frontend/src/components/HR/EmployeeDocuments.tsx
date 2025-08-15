import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

const EmployeeDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDocuments([
        {
          id: '1',
          name: 'CPF.pdf',
          type: 'CPF',
          size: '245 KB',
          uploadDate: '2024-01-15',
          status: 'approved'
        },
        {
          id: '2',
          name: 'RG.pdf',
          type: 'RG',
          size: '312 KB',
          uploadDate: '2024-01-14',
          status: 'approved'
        },
        {
          id: '3',
          name: 'Comprovante_Residencia.pdf',
          type: 'Comprovante de Residência',
          size: '189 KB',
          uploadDate: '2024-01-10',
          status: 'pending'
        },
        {
          id: '4',
          name: 'Diploma.pdf',
          type: 'Diploma',
          size: '567 KB',
          uploadDate: '2024-01-08',
          status: 'approved'
        }
      ]);
      
      setLoading(false);
    };

    loadDocuments();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    // Simular upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: files[0].name,
      type: 'Documento Geral',
      size: `${Math.round(files[0].size / 1024)} KB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setDocuments(prev => [newDocument, ...prev]);
    setUploading(false);
    
    // Reset input
    event.target.value = '';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: 'Aprovado', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      pending: { label: 'Pendente', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      rejected: { label: 'Rejeitado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDocumentIcon = (_type: string) => {
    return (
      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white/10 rounded animate-pulse"></div>
          <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-1/3"></div>
                  <div className="h-3 bg-white/5 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-white/10 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/funcionarios/detalhes/${id}`)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Documentos do Funcionário</h1>
            <p className="text-gray-400">Gerencie documentos pessoais e profissionais</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`btn btn-primary cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Enviar Documento
              </>
            )}
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total de Documentos</h3>
          <p className="text-2xl font-bold text-blue-400">{documents.length}</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Aprovados</h3>
          <p className="text-2xl font-bold text-green-400">
            {documents.filter(doc => doc.status === 'approved').length}
          </p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Pendentes</h3>
          <p className="text-2xl font-bold text-orange-400">
            {documents.filter(doc => doc.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="glass-card p-6 hover-lift transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                  {getDocumentIcon(document.type)}
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {document.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-400 text-sm">{document.type}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{document.size}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-400 text-sm">{formatDate(document.uploadDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {getStatusBadge(document.status)}
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-blue-400"
                    title="Visualizar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-green-400"
                    title="Download"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-red-400"
                    title="Excluir"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Nenhum documento encontrado</h3>
          <p className="text-gray-400 mb-4">
            Faça upload dos documentos do funcionário para começar.
          </p>
          <label
            htmlFor="file-upload"
            className="btn btn-primary cursor-pointer"
          >
            Enviar Primeiro Documento
          </label>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Instruções de Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Formatos Aceitos</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• PDF (.pdf)</li>
              <li>• Word (.doc, .docx)</li>
              <li>• Imagens (.jpg, .jpeg, .png)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Tamanho Máximo</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Máximo 10MB por arquivo</li>
              <li>• Resolução mínima: 300 DPI</li>
              <li>• Documentos legíveis e completos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocuments;

