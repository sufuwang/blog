import { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu as _Menu, Switch } from 'antd'
import { useEditorStore, MeshTypes } from '@/store/3dScene/editor'

const Menus = [
  {
    label: 'Create',
    key: 'create',
    children: [
      {
        type: 'group',
        label: '物体',
        children: [
          { label: '立方体', key: MeshTypes.Box },
          { label: '圆柱体', key: MeshTypes.Cylinder },
        ],
      },
      {
        type: 'group',
        label: '灯光',
        children: [
          { label: '点光源', key: 'light-1' },
          { label: '平行关', key: 'light-2' },
        ],
      },
    ],
  },
]

export default function Menu() {
  const [current, setCurrent] = useState('mail')
  const { addMesh } = useEditorStore()

  const onClick: MenuProps['onClick'] = ({ keyPath, key }) => {
    setCurrent(key)
    if (keyPath[1] === 'create') {
      if (key === MeshTypes.Box) {
        addMesh('Box', { x: 100, y: 100, z: 100 })
      } else if (key === MeshTypes.Cylinder) {
        addMesh('Cylinder', { x: -100, y: -100, z: -100 })
      } else if (key === 'light-1') {
        console.info('创建点光源')
      } else if (key === 'light-2') {
        console.info('创建平行光')
      }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <_Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={Menus} />
      <div>
        <Switch size="small" defaultChecked title="开启平移" />
      </div>
    </div>
  )
}
