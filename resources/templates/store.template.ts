import { create } from 'zustand'
import { IEntity, IEntityCreatePayload } from '@/store/interfaces/entity.interface'
import { entityService } from '@/store/services/entity.service'

interface EntityState {
  entityList: IEntity[]
  total: number
  selectedEntity: IEntity | null
  onLoading: boolean
  onError: boolean
  error: string

  entityGetAll: () => Promise<void>
  entityCreate: (payload: IEntityCreatePayload) => Promise<boolean>
  resetError: () => void
}

export const useEntityStore = create<EntityState>((set, get) => ({
  entityList: [],
  total: 0,
  selectedEntity: null,
  onLoading: false,
  onError: false,
  error: '',

  entityGetAll: async () => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await entityService.getAll()
      if (!response.success) {
        throw new Error(response.error ?? 'Error al obtener registros')
      }
      set({
        entityList: response.data.data,
        total: response.data.total,
        onLoading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener registros'
      set({ onLoading: false, onError: true, error: message })
    }
  },

  entityCreate: async (payload) => {
    set({ onLoading: true, onError: false, error: '' })
    try {
      const { data: response } = await entityService.create(payload)
      if (!response.success) {
        throw new Error(response.error ?? 'Error al crear registro')
      }
      await get().entityGetAll()
      set({ onLoading: false })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear registro'
      set({ onLoading: false, onError: true, error: message })
      return false
    }
  },

  resetError: () => set({ onError: false, error: '' }),
}))
