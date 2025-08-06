'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls } from 'three/examples/jsm/Addons'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
// @ts-ignore
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'

export default function IrRegularGeometry() {
  const items: TabsProps['items'] = [
    {
      label: '凸包几何体',
      children: <Convex />,
    },
    {
      label: 'Shape 几何体',
      children: <Shape />,
    },
    {
      label: '拉伸几何体',
      children: <Extrude />,
    },
    {
      label: '旋转几何体',
      children: <Lathe />,
    },
    {
      label: '管道几何体',
      children: <Tube />,
    },
    {
      label: '参数曲面',
      children: <Parametric />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey={items.at(-1)!.key} items={items} />
}

const Convex = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(200, 200, 200)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const points: THREE.Vector3[] = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(60, 0, 0),
      new THREE.Vector3(0, 60, 0),
      new THREE.Vector3(0, 0, 60),
    ]
    const geometry = new ConvexGeometry(points)
    const material = new THREE.MeshNormalMaterial()
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Shape = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(120, 120, 120)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, 60)
    shape.lineTo(60, 60)
    shape.lineTo(60, 0)
    const path = new THREE.Path()
    path.arc(30, 30, 20, 0, Math.PI * 4, false)
    shape.holes.push(path)
    const geometry = new THREE.ShapeGeometry(shape)
    const material = new THREE.MeshNormalMaterial()
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Extrude = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(120, 120, 120)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(0, 60)
    shape.lineTo(60, 60)
    shape.lineTo(60, 0)
    const path = new THREE.Path()
    path.arc(30, 30, 20, 0, Math.PI * 4, false)
    shape.holes.push(path)
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 12 })
    const material = new THREE.MeshNormalMaterial()
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Lathe = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(120, 120, 120)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(20, 20),
      new THREE.Vector2(40, 40),
      new THREE.Vector2(20, 60),
      new THREE.Vector2(0, 80),
    ]
    const geometry = new THREE.LatheGeometry(points, 20)
    const material = new THREE.MeshNormalMaterial()
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Tube = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(120, 120, 120)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const points = [
      new THREE.Vector3(-100, 50, 50),
      new THREE.Vector3(50, 150, 0),
      new THREE.Vector3(100, 0, 100),
      new THREE.Vector3(100, 50, -50),
    ]
    const curve = new THREE.CubicBezierCurve3(...points)
    const geometry = new THREE.TubeGeometry(curve, 100, 20, 20)
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Parametric = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(120, 120, 120)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    const func = (u, v, target) => {
      const _u = u * Math.PI
      const _v = v * 2 * Math.PI
      const x = Math.sin(_u) * Math.cos(_v)
      const y = Math.sin(_u) * Math.sin(_v)
      const z = Math.cos(_u)
      target.set(x * 60, y * 60, z * 60)
    }
    const geometry = new ParametricGeometry(func, 50, 50)
    const material = new THREE.MeshNormalMaterial()
    scene.add(new THREE.Mesh(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
