'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls } from 'three/examples/jsm/Addons'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { Reflector, RGBELoader } from 'three/examples/jsm/Addons.js'

export default function Light() {
  const items: TabsProps['items'] = [
    {
      label: '立方体摄像机',
      children: <CubeCamera />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey="立方体摄像机" items={items} />
}

const CubeCamera = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    // 创建场景、渲染器和主摄像机
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    // 添加环境光
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/material/city/san_giuseppe_bridge_2k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      scene.background = texture
    })

    // 添加一个动态反射的球体
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    })

    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)
    scene.add(cubeCamera)

    const reflectiveMaterial = new THREE.MeshBasicMaterial({
      envMap: cubeRenderTarget.texture,
    })
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32), reflectiveMaterial)
    scene.add(sphere)

    new OrbitControls(camera, renderer.domElement)

    // 动画循环
    function animate() {
      cubeCamera.position.copy(sphere.position)
      cubeCamera.update(renderer, scene)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
