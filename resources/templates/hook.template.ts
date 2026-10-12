import { useEntityStore } from '@/store/zustand/entity.store'

export const useEntity = () => {
  const entityGetAll   = useEntityStore((s) => s.entityGetAll)
  const entityCreate   = useEntityStore((s) => s.entityCreate)
  const entityList     = useEntityStore((s) => s.entityList)
  const total          = useEntityStore((s) => s.total)
  const selectedEntity = useEntityStore((s) => s.selectedEntity)
  const onLoading      = useEntityStore((s) => s.onLoading)
  const onError        = useEntityStore((s) => s.onError)
  const error          = useEntityStore((s) => s.error)
  const resetError     = useEntityStore((s) => s.resetError)

  return {
    entityGetAll,
    entityCreate,
    entityList,
    total,
    selectedEntity,
    onLoading,
    onError,
    error,
    resetError,
  }
}
