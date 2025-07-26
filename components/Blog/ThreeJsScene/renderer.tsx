'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getSizeByScreenRatio } from '@/tools/utils'
import {
  OrbitControls,
  CSS2DRenderer,
  CSS2DObject,
  CSS3DRenderer,
  CSS3DObject,
} from 'three/examples/jsm/Addons'

export default function Light() {
  const items: TabsProps['items'] = [
    {
      label: 'CSS2DRenderer',
      children: <CSS2D />,
    },
    {
      label: 'CSS3DRenderer',
      children: <CSS3D />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey="CSS2DRenderer" items={items} />
}

const CSS2D = () => {
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
    scene.add(new THREE.Mesh(boxGeo, material))

    const ele = document.createElement('div')
    ele.innerHTML = '<p style="background:green;padding: 10px;">2D Object</p>'
    const obj = new CSS2DObject(ele)
    obj.position.y = 80
    scene.add(obj)

    const css2Renderer = new CSS2DRenderer()
    css2Renderer.setSize(width, height)
    css2Renderer.domElement.style.position = 'absolute'
    css2Renderer.domElement.style.pointerEvents = 'none'
    const div = document.createElement('div')
    div.style.position = 'relative'
    div.appendChild(css2Renderer.domElement)
    c.appendChild(div)

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      css2Renderer.render(scene, camera)
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const CSS3D = () => {
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
    scene.add(new THREE.Mesh(boxGeo, material))

    const ele = document.createElement('div')
    ele.innerHTML = '<p style="background:green;padding: 10px;">3D Object</p>'
    const obj = new CSS3DObject(ele)
    obj.position.y = 80
    scene.add(obj)

    const css3Renderer = new CSS3DRenderer()
    css3Renderer.setSize(width, height)
    css3Renderer.domElement.style.position = 'absolute'
    css3Renderer.domElement.style.pointerEvents = 'none'
    const div = document.createElement('div')
    div.style.position = 'relative'
    div.appendChild(css3Renderer.domElement)
    c.appendChild(div)

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      css3Renderer.render(scene, camera)
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
