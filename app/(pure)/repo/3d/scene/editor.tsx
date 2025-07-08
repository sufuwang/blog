import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import Menu from '@/components/3DScene/Editor/Menu'
import renderMain, { createMesh, focusMesh } from '@/components/3DScene/Editor/Main'
import Properties from '@/components/3DScene/Editor/Properties'
import { useEditorStore } from '@/store/3dScene/editor'
import { Splitter } from 'antd'

export default function InfiniteTube() {
  const ref = useRef(null)
  const [scene, setScene] = useState<Scene.Mesh | null>(null)
  const { data, addMesh, setSelectedMeshId, setPosition } = useEditorStore()

  const onClickMesh = (mesh) => {
    console.info('mesh.object._id: ', mesh.object._id)
    setSelectedMeshId(mesh.object._id)
  }
  const onChangeTransformControls = (mesh) => {
    setPosition(mesh._id, mesh.position)
  }
  const onResize = (size) => {
    console.info('onResize', size)
  }

  useEffect(() => {
    if (ref.current) {
      const { scene: s, onResize } = renderMain(ref.current, data.meshes, {
        onClickMesh,
        onChangeTransformControls,
      })
      setScene(s)
    }
  }, [])
  useEffect(() => {
    if (scene) {
      console.info('ddd: ', data)
      if (data.canUpdate) {
        // scene.children.forEach((child) => {
        //   if (child.type === 'Mesh') {
        //     scene.remove(child)
        //   }
        // })
        // if (data.meshes.length) {
        //   scene.add(...createMesh(data.meshes))
        // }
      }
      focusMesh(scene, data.curSelectedMeshId)
    }
  }, [data])

  return (
    <Splitter onResize={onResize}>
      <Splitter.Panel defaultSize="40%" min="20%" max="70%">
        <div className="h-[100%]" ref={ref} />
      </Splitter.Panel>
      <Splitter.Panel>
        <div className="flex flex-col">
          <Menu />
          <Properties scene={scene} />
        </div>
      </Splitter.Panel>
    </Splitter>
  )
}
