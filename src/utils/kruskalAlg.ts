import axios from 'axios'

export interface NodeData {
  id: number | string
  x: number
  y: number
  name: string
  color?: string
}

export interface EdgeData {
  id: string
  node1: NodeData
  node2: NodeData
  weight: number
  color?: string
  calculated?: {
    startX: number
    startY: number
    endX: number
    endY: number
  }
}

/**
 * Llama al endpoint Flask para obtener los IDs de las aristas del MST.
 * @param nodes Lista de nodos
 * @param edges Lista de aristas
 * @param maximize Si true, calcula el árbol máximo
 * @returns Promise<string[]> Array de IDs de aristas del MST
 */
export async function fetchMstEdgeIds(
  nodes: NodeData[],
  edges: EdgeData[],
  maximize = false
): Promise<string[]> {
  const url = `http://127.0.0.1:5000/graph/spanning_tree?maximize=${maximize}`
  const { data } = await axios.post(url, { nodes, edges })
  return Object.keys(data.data_mst.edges)
}

/**
 * Dados todos los edges y los IDs del MST, devuelve un nuevo array
 * con la propiedad `color` actualizada y los cálculos de posición.
 */
export function colorEdges(
  edges: EdgeData[],
  mstEdgeIds: string[],
  mstColors: Record<string,string>
): EdgeData[] {
  const radius = 22.5
  const mstSet = new Set(mstEdgeIds)
  return edges.map(edge => {
    const dx = edge.node2.x - edge.node1.x
    const dy = edge.node2.y - edge.node1.y
    const angle = Math.atan2(dy, dx)
    const startX = edge.node1.x + Math.cos(angle) * radius
    const startY = edge.node1.y + Math.sin(angle) * radius
    const endX = edge.node2.x - Math.cos(angle) * radius
    const endY = edge.node2.y - Math.sin(angle) * radius

    return {
      ...edge,
      calculated: { startX, startY, endX, endY },
      color: mstSet.has(edge.id)
      ? (mstColors[edge.id] || '#000000')
      : (edge.color || '#000000')
    }
  })
}
