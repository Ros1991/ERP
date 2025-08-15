import api from '../../lib/axios';
import { API_CONFIG } from '../../config/api.config';
import type { Empresa, CreateEmpresaDTO, UpdateEmpresaDTO } from '../../models/empresa/Empresa.model';
import type { PaginatedResponse, QueryParams } from '../../types/common.types';

class EmpresaService {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Empresa>> {
    const response = await api.get<PaginatedResponse<Empresa>>(
      API_CONFIG.endpoints.empresas,
      { params }
    );
    return response.data;
  }

  async getById(id: string): Promise<Empresa> {
    const response = await api.get<Empresa>(
      `${API_CONFIG.endpoints.empresas}/${id}`
    );
    return response.data;
  }

  async create(data: CreateEmpresaDTO): Promise<Empresa> {
    const response = await api.post<Empresa>(
      API_CONFIG.endpoints.empresas,
      data
    );
    return response.data;
  }

  async update(id: string, data: UpdateEmpresaDTO): Promise<Empresa> {
    const response = await api.put<Empresa>(
      `${API_CONFIG.endpoints.empresas}/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${API_CONFIG.endpoints.empresas}/${id}`);
  }

  async getMyEmpresas(): Promise<Empresa[]> {
    const response = await api.get<Empresa[]>(
      `${API_CONFIG.endpoints.empresas}/minhas`
    );
    return response.data;
  }

  async switchEmpresa(empresaId: string): Promise<void> {
    await api.post(
      `${API_CONFIG.endpoints.empresas}/${empresaId}/switch`
    );
  }
}

export const empresaService = new EmpresaService();
