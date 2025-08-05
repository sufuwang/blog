'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getSizeByScreenRatio } from '@/tools/utils'
import { DragControls, OrbitControls, TransformControls } from 'three/examples/jsm/Addons'

export default function Controls() {
  const items: TabsProps['items'] = [
    {
      label: 'DragControls',
      children: <TDragControls />,
    },
    {
      label: 'TransformControls',
      children: <TTransformControls />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey="DragControls" items={items} />
}

const TDragControls = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    renderer.setClearColor('lightblue')

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    const box = new THREE.Mesh(boxGeo, material)
    scene.add(box)

    new DragControls([box], camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const TTransformControls = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!
    const scene = new THREE.Scene()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    })
    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    renderer.setClearColor('lightblue')

    const axesHelper = new THREE.AxesHelper(60)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
    camera.position.set(200, 200, 200)
    camera.lookAt(0, 0, 0)

    const light = new THREE.AmbientLight(0xffffff, 100000)
    scene.add(light)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    const box = new THREE.Mesh(boxGeo, material)
    scene.add(box)

    new OrbitControls(camera, renderer.domElement)

    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.attach(box)
    scene.add(transformControls.getHelper())

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
