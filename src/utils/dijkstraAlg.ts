import axios from 'axios'
import type { NodeData, EdgeData } from './kruskalAlg'

export async function fetchDijkstraEdgeIds(
  nodes: NodeData[],
  edges: EdgeData[],
  start: string,
  end: string,
  maximize: boolean
): Promise<string[]> {
  const url = `http://127.0.0.1:5000/graph/dijkstra?start=${start}&end=${end}&maximize=${maximize}`
  console.log('[dijkstraAlg] URL:', url)
  console.log('[dijkstraAlg] nodes:', nodes)
  console.log('[dijkstraAlg] edges:', edges)

  const resp = await axios.post(url, { nodes, edges })
  console.log('[dijkstraAlg] status:', resp.status)
  console.log('[dijkstraAlg] data:', resp.data)

  const data = resp.data

  let edgeIds: string[] = []

  if (data.targetPath) {
    edgeIds = Object.values(data.targetPath)
      .flatMap((p: any) => p.edges)
    console.log('[dijkstraAlg] all targetPath edges:', edgeIds)
  }

  // Si no hubiera targetPath, fallback a data.nodes[end].path
  if (!edgeIds.length && data.nodes?.[end]?.path) {
    edgeIds = data.nodes[end].path
    console.warn('[dijkstraAlg] fallback to data.nodes[end].path:', edgeIds)
  }

  console.log('[dijkstraAlg] final edge IDs:', edgeIds)
  return edgeIds
}
