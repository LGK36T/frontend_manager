import { EntityList } from '@/components/functional/EntityList'

// En Next.js 15+, las páginas son Server Components delgadas
export default function EntityPage() {
  return <EntityList />
}

// Para páginas dinámicas con parámetros en Next.js 15+:
// export default async function EntityDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params
//   return <EntityDetail entityId={id} />
// }
