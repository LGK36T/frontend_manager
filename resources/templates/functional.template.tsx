'use client'

import React, { useEffect } from 'react'
import { useEntity } from '@/store/hooks/useEntity.hook'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Table, Column } from '@/components/ui/Table'
import { IEntity } from '@/store/interfaces/entity.interface'

const columns: Column<IEntity>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'status', label: 'Estado' },
]

export const EntityList: React.FC = () => {
  const { entityGetAll, entityList, total, onLoading, onError, error } = useEntity()

  useEffect(() => {
    entityGetAll()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Listado</h1>
          {!onLoading && !onError && (
            <p className="text-sm text-muted-foreground">{total} elementos registrados</p>
          )}
        </div>
        <Button label="Recargar" onClick={entityGetAll} disabled={onLoading} variant="secondary" />
      </div>

      {/* 1. Estado de Carga */}
      {onLoading && <Spinner />}

      {/* 2. Estado de Error con Reintento */}
      {onError && !onLoading && <ErrorMessage message={error} onRetry={entityGetAll} />}

      {/* 3. Estado de Éxito / Datos */}
      {!onLoading && !onError && (
        <Table data={entityList} columns={columns} emptyMessage="No hay registros disponibles" />
      )}
    </div>
  )
}
