import { create } from 'zustand'

const MeshTypes = { Box: 'Box', Cylinder: 'Cylinder' } as const

function createBox(position = { x: 0, y: 0, z: 0 }) {
  const newId = Math.random().toString().slice(2, 10)
  return {
    id: newId,
    type: MeshTypes.Box,
    name: 'Box-' + newId,
    props: { width: 200, height: 200, depth: 200, material: { color: 'orange' }, position },
  }
}
function createCylinder(position = { x: 0, y: 0, z: 0 }) {
  const newId = Math.random().toString().slice(2, 8)
  return {
    id: newId,
    type: MeshTypes.Cylinder,
    name: 'Cylinder-' + newId,
    props: {
      radiusTop: 200,
      radiusBottom: 200,
      height: 300,
      material: { color: 'orange' },
      position,
    },
  }
}

const useEditorStore = create<{
  data: EditorStore
  addMesh: (type: keyof typeof MeshTypes, position) => void
  removeMesh: (id: string) => void
  setSelectedMeshId: (id: string) => void
  setPosition: (id: string, position: Scene.Position) => void
  setUpdateStatus: (canUpdate: boolean) => void
}>((set, get) => {
  return {
    data: { curSelectedMeshId: '', canUpdate: true, meshes: [createBox()] },
    addMesh(type: keyof typeof MeshTypes, position) {
      if (type === MeshTypes.Box) {
        set((state) => {
          return { data: { ...state.data, meshes: [...state.data.meshes, createBox(position)] } }
        })
      } else if (type === MeshTypes.Cylinder) {
        set((state) => {
          return {
            data: { ...state.data, meshes: [...state.data.meshes, createCylinder(position)] },
          }
        })
      }
    },
    removeMesh(id = '') {
      set((state) => {
        return {
          data: {
            ...state.data,
            curSelectedMeshId: '',
            meshes: state.data.meshes.filter((row) => row.id !== id),
          },
        }
      })
    },
    setSelectedMeshId(id = '') {
      if (id === get().data.curSelectedMeshId) {
        return
      }
      set((state) => {
        return { data: { ...state.data, curSelectedMeshId: id } }
      })
    },
    setPosition(id, position) {
      const meshes: EditorStore['meshes'] = JSON.parse(JSON.stringify(get().data.meshes))
      meshes.forEach((row) => {
        if (row.id === id) {
          row.props.position = position
        }
      })

      set((state) => {
        return { data: { ...state.data, meshes } }
      })
    },
    setUpdateStatus(canUpdate) {
      set((state) => {
        return { data: { ...state.data, canUpdate } }
      })
    },
  }
})

export { useEditorStore, MeshTypes }
export interface EditorStore {
  curSelectedMeshId: string
  canUpdate: boolean
  meshes: Array<ReturnType<typeof createBox | typeof createCylinder>>
}
