'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls, RectAreaLightHelper } from 'three/examples/jsm/Addons'

export default function Light() {
  const items: TabsProps['items'] = [
    {
      label: '环境光',
      children: <AmbientLight />,
    },
    {
      label: '方向光',
      children: <DirectionalLight />,
    },
    {
      label: '点光源',
      children: <PointLight />,
    },
    {
      label: '聚光灯',
      children: <SpotLight />,
    },
    {
      label: '平行光',
      children: <HemisphereLight />,
    },
    {
      label: '矩形区域光',
      children: <RectAreaLight />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey="AmbientLight" items={items} />
}

const AmbientLight = () => {
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

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const DirectionalLight = () => {
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
    camera.position.set(300, 0, 0)
    camera.lookAt(0, 0, 0)

    const light = new THREE.DirectionalLight(0xffffff, 10)
    light.position.set(80, 80, 80)
    const helper = new THREE.DirectionalLightHelper(light, 10)
    scene.add(light, helper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const PointLight = () => {
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
    camera.position.set(300, 0, 0)
    camera.lookAt(0, 0, 0)

    const light = new THREE.PointLight(0xffffff, 10000)
    light.position.set(60, 60, 60)
    const helper = new THREE.PointLightHelper(light, 10)
    scene.add(light, helper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const SpotLight = () => {
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
    camera.position.set(200, 0, 0)
    camera.lookAt(0, 0, 0)

    const light = new THREE.SpotLight(0xffffff, 100000)
    light.position.set(60, 60, 60)
    const helper = new THREE.SpotLightHelper(light)
    scene.add(light, helper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const HemisphereLight = () => {
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
    camera.position.set(200, 0, 0)
    camera.lookAt(0, 0, 0)

    const light = new THREE.HemisphereLight(0xffffff, 10)
    light.position.set(60, 60, 60)
    const helper = new THREE.HemisphereLightHelper(light, 10)
    scene.add(light, helper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const RectAreaLight = () => {
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
    camera.position.set(100, 100, 100)
    camera.lookAt(0, 0, 0)

    const light = new THREE.RectAreaLight(0xffffff, 10)
    light.position.set(0, 0, 60)
    const helper = new RectAreaLightHelper(light)
    scene.add(light, helper)

    const boxGeo = new THREE.BoxGeometry(60, 60, 60)
    const material = new THREE.MeshStandardMaterial({
      color: 'rgb(180,180,180)',
    })
    scene.add(new THREE.Mesh(boxGeo, material))

    new OrbitControls(camera, renderer.domElement)

    c.appendChild(renderer.domElement)

    const r = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(r)
    }
    r()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
