import * as THREE from 'three'
import { useEditorStore } from '@/store/3dScene/editor'
import { useEffect, useState } from 'react'
import { InputNumber as _InputNumber, Switch } from 'antd'
import { transformMesh, disableOrbitControls } from './Main'

interface Props {
  scene: Scene.Mesh | null
}
type InputNumber = <K extends keyof Scene.Position>({ k }: { k: K }) => JSX.Element

export default function Properties({ scene }: Props) {
  const { data, setPosition, setUpdateStatus } = useEditorStore()
  const [curMesh, setCurMesh] = useState<Scene.Mesh>()
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    if (!scene) {
      return
    }
    const c = scene.children.find(
      (row: Scene.Mesh) => row._id === data.curSelectedMeshId
    ) as Scene.Mesh
    setCurMesh(c)
    if (c) {
      setPos(c.position)
    }
  }, [data.curSelectedMeshId])

  useEffect(() => {
    if (scene && curMesh) {
      setPosition(data.curSelectedMeshId, pos)
    }
  }, [pos])

  const InputNumber: InputNumber = ({ k }) => {
    return (
      <div className="flex items-center">
        {k}:
        <_InputNumber
          className="ml-2"
          value={pos[k]}
          onChange={(value) => setPos({ ...pos, [k]: value || 0 })}
        />
      </div>
    )
  }

  const onChangeTransform = (f) => {
    if (curMesh) {
      transformMesh(scene!, curMesh._id)
      setUpdateStatus(!f)
    }
  }

  return (
    <>
      {curMesh ? (
        <>
          <div className="m-2 flex flex-col justify-center">
            <InputNumber k={'x'} />
            <InputNumber k={'y'} />
            <InputNumber k={'z'} />
          </div>
          <div>
            <Switch onChange={onChangeTransform} /> 开启 Transform
          </div>
        </>
      ) : (
        <>请选择某个 Mesh</>
      )}
      <div>
        <Switch defaultChecked onChange={(f) => disableOrbitControls(f)} /> 开启 OrbitControl
      </div>
    </>
  )
}
