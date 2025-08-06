'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getSizeByScreenRatio } from '@/tools/utils'
import { OrbitControls } from 'three/examples/jsm/Addons'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

export default function RegularGeometry() {
  const items: TabsProps['items'] = [
    {
      label: '立方体',
      children: <Box />,
    },
    {
      label: '球体',
      children: <Sphere />,
    },
    {
      label: '圆柱体',
      children: <Cylinder />,
    },
    {
      label: '圆锥体',
      children: <Cone />,
    },
    {
      label: '圆形',
      children: <Circle />,
    },
    {
      label: '平面',
      children: <Plane />,
    },
    {
      label: '环形',
      children: <Ring />,
    },
    {
      label: '圆环体',
      children: <Torus />,
    },
    {
      label: '圆环结',
      children: <TorusKnot />,
    },
    {
      label: '四面体',
      children: <Tetrahedron />,
    },
    {
      label: '八面体',
      children: <Octahedron />,
    },
    {
      label: '十二面体',
      children: <Dodecahedron />,
    },
    {
      label: '二十面体',
      children: <Icosahedron />,
    },
  ].map((row) => ({ ...row, key: row.label }))

  return <Tabs defaultActiveKey={items.at(-1)!.key} items={items} />
}

const getMesh = (geometry, materialParameters: THREE.MeshNormalMaterialParameters = {}) => {
  const material = new THREE.MeshNormalMaterial(materialParameters)
  return new THREE.Mesh(geometry, material)
}

const Box = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.BoxGeometry(40, 40, 40)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Sphere = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.SphereGeometry(40)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Cylinder = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))

    // radiusTop: 60, radiusBottom: 60, height: 60
    scene.add(getMesh(new THREE.CylinderGeometry(60, 60, 60)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Cone = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    // radius: 60, height: 60
    scene.add(getMesh(new THREE.ConeGeometry(60, 60)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Circle = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.CircleGeometry(60)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Plane = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.PlaneGeometry(60, 60), { side: THREE.DoubleSide }))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Ring = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    // innerRadius: 60, outerRadius: 66
    scene.add(getMesh(new THREE.RingGeometry(60, 66)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Torus = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    // radius: 60, tube: 16
    scene.add(getMesh(new THREE.TorusGeometry(60, 16)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const TorusKnot = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.TorusKnotGeometry(60, 16)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Octahedron = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.OctahedronGeometry(80)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Tetrahedron = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.TetrahedronGeometry(80)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Icosahedron = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.IcosahedronGeometry(80)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
const Dodecahedron = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const c = ref.current!

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    const { width, height } = getSizeByScreenRatio(c.clientWidth)
    renderer.setSize(width, height)
    c.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 300)

    scene.add(new THREE.PointLight(0xffffff, 0.5))
    scene.add(new THREE.AxesHelper(100))
    scene.add(getMesh(new THREE.DodecahedronGeometry(80)))

    new OrbitControls(camera, renderer.domElement)

    function animate() {
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])
  return <div ref={ref} className="overflow-hidden rounded-b-lg" />
}
