'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls } from 'three/examples/jsm/Addons'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

export default function Line() {
  const items: TabsProps['items'] = [
    {
      label: 'LineLoop',
      children: <LineLoop />,
    },
    {
      label: 'LineCurve(3)',
      children: <LineCurve />,
    },
    {
      label: 'QuadraticBezierCurve(3)',
      children: <QuadraticBezierCurve />,
    },
    {
      label: 'CubicBezierCurve(3)',
      children: <CubicBezierCurve />,
    },
    {
      label: 'ArcCurve',
      children: <ArcCurve />,
    },
    {
      label: 'EllipseCurve',
      children: <EllipseCurve />,
    },
    {
      label: 'CatmullRomCurve3',
      children: <CatmullRomCurve3 />,
    },
    {
      label: 'SplineCurve',
      children: <SplineCurve />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey={items.at(-1)!.key} items={items} />
}

const getLineMesh = (path) => {
  const geometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(100))
  const material = new THREE.LineBasicMaterial({ color: 0xffffff })
  return new THREE.Line(geometry, material)
}

const LineLoop = () => {
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

    const points = [
      new THREE.Vector3(0, 60, 0),
      new THREE.Vector3(0, 0, 60),
      new THREE.Vector3(60, 0, 0),
    ]
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({
      color: '#ffffff',
    })
    geometry.setFromPoints(points)
    scene.add(new THREE.LineLoop(geometry, material))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const LineCurve = () => {
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

    const path = new THREE.CurvePath<THREE.Vector2>()
    path.add(new THREE.LineCurve(new THREE.Vector2(0, 60), new THREE.Vector2(60, 0)))
    scene.add(getLineMesh(path))

    {
      const path = new THREE.CurvePath<THREE.Vector3>()
      path.add(new THREE.LineCurve3(new THREE.Vector3(60, 0, 0), new THREE.Vector3(0, 0, 60)))
      scene.add(getLineMesh(path))
    }

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const QuadraticBezierCurve = () => {
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

    const curve = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(50, 100),
      new THREE.Vector2(100, 0)
    )
    scene.add(getLineMesh(curve))

    {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 20),
        new THREE.Vector3(-50, 100, 20),
        new THREE.Vector3(-100, 0, 20)
      )
      scene.add(getLineMesh(curve))
    }

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const CubicBezierCurve = () => {
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

    const curve = new THREE.CubicBezierCurve(
      new THREE.Vector2(0, 0),
      new THREE.Vector2(50, 100),
      new THREE.Vector2(80, 10),
      new THREE.Vector2(150, 0)
    )
    scene.add(getLineMesh(curve))

    {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 20),
        new THREE.Vector3(-50, 100, 20),
        new THREE.Vector3(-80, 10, 20),
        new THREE.Vector3(-150, 0, 20)
      )
      scene.add(getLineMesh(curve))
    }

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const ArcCurve = () => {
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

    const curve = new THREE.ArcCurve(0, 0, 60, 0, Math.PI)
    scene.add(getLineMesh(curve))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const EllipseCurve = () => {
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

    const curve = new THREE.EllipseCurve(0, 0, 100, 60, 0, Math.PI)
    scene.add(getLineMesh(curve))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const CatmullRomCurve3 = () => {
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

    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(60, 60, -60),
      new THREE.Vector3(0, 100, -100),
    ])
    scene.add(getLineMesh(path))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const SplineCurve = () => {
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

    const path = new THREE.SplineCurve([
      new THREE.Vector2(0, 0),
      new THREE.Vector2(60, 60),
      new THREE.Vector2(0, 100),
    ])
    scene.add(getLineMesh(path))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
