import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import Menu from '@/components/3DScene/Editor/Menu'
import renderMain, { createMesh } from '@/components/3DScene/Editor/Main'
import Properties from '@/components/3DScene/Editor/Properties'
import { useEditorStore } from '@/store/3dScene/editor'
import { Splitter } from 'antd'

export default function InfiniteTube() {
  const ref = useRef(null)
  const [scene, setScene] = useState<THREE.Scene | null>(null)
  const { data, addMesh } = useEditorStore()

  useEffect(() => {
    if (ref.current) {
      const { scene: s, onResize } = renderMain(ref.current, data.meshes)
      setScene(s)
    }
  }, [])
  useEffect(() => {
    scene?.add(...createMesh(data.meshes))
  }, [data.meshes])

  const onResize = (size) => {
    console.info('onResize', size)
  }

  return (
    <Splitter onResize={onResize}>
      <Splitter.Panel defaultSize="40%" min="20%" max="70%">
        <div className="h-[100%]" ref={ref} />
      </Splitter.Panel>
      <Splitter.Panel>
        <div className="flex flex-col">
          <Menu />
          <Properties />
        </div>
      </Splitter.Panel>
    </Splitter>
  )
}
