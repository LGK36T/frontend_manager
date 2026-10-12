import { api } from '@/utils/api'
import { IDataResponse } from '@/store/interfaces/response.interface'
import { IEntity, IEntityGetAllResponse, IEntityCreatePayload } from '@/store/interfaces/entity.interface'

export const entityService = {
  getAll: () =>
    api.get<IDataResponse<IEntityGetAllResponse>>('/entity/getAll'),

  getById: (id: string) =>
    api.get<IDataResponse<IEntity>>(`/entity/getById/${id}`),

  create: (payload: IEntityCreatePayload) =>
    api.post<IDataResponse<IEntity>>('/entity/create', payload),

  update: (id: string, payload: Partial<IEntityCreatePayload>) =>
    api.put<IDataResponse<IEntity>>(`/entity/update/${id}`, payload),

  remove: (id: string) =>
    api.delete<IDataResponse<boolean>>(`/entity/delete/${id}`),
}
