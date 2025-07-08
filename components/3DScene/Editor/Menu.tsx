import { useEffect, useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu as _Menu, Switch } from 'antd'
import { useEditorStore, MeshTypes } from '@/store/3dScene/editor'
import type { SubMenuType } from 'antd/es/menu/interface'

export default function Menu() {
  const [Menus, setMenus] = useState<SubMenuType[]>([
    { label: 'List', key: 'list', disabled: true, children: [] },
    {
      label: 'Operate',
      key: 'operate',
      disabled: true,
      children: [{ label: 'Remove', key: 'remove' }],
    },
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
  ])

  const [current, setCurrent] = useState('mail')
  const { data, addMesh, removeMesh, setSelectedMeshId } = useEditorStore()

  useEffect(() => {
    const menus = JSON.parse(JSON.stringify(Menus))
    const list = menus.find((row) => row.key === 'list')
    list.children = data.meshes.map((row) => ({ label: row.name, key: row.id }))
    list.disabled = list.children.length === 0
    menus.find((row) => row.key === 'operate').disabled = data.curSelectedMeshId.length === 0
    setMenus(menus)
  }, [data])

  const onClick: MenuProps['onClick'] = ({ keyPath, key }) => {
    setCurrent(key)
    const [_, k] = keyPath
    if (k === 'create') {
      if (key === MeshTypes.Box) {
        addMesh('Box', { x: 100, y: 100, z: 100 })
      } else if (key === MeshTypes.Cylinder) {
        addMesh('Cylinder', { x: -100, y: -100, z: -100 })
      } else if (key === 'light-1') {
        console.info('创建点光源')
      } else if (key === 'light-2') {
        console.info('创建平行光')
      }
    } else if (k === 'list') {
      setSelectedMeshId(key)
    } else if (k === 'operate') {
      console.info('remove:', key, data.curSelectedMeshId)
      removeMesh(data.curSelectedMeshId)
    }
  }

  return (
    <div>
      <_Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={Menus} />
      {/* <div>
        <Switch size="small" defaultChecked title="开启平移" />
      </div> */}
    </div>
  )
}
